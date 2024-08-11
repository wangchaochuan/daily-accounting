<template>
  <view class="container">
    <view @click="showKeybord">
      <u-input
        :placeholder="placeholder"
        readonly
        :modelValue="value"
        @change="onchange"
      ></u-input>
    </view>
    <u-popup
      :show="visible"
      :closeable="true"
      :closeOnClickOverlay="false"
      :round="12"
      @close="close"
      @open="open"
    >
      <view class="text" v-show="value">{{ value }}</view>
      <view class="keyword">
        <view class="row">
          <view class="num" hover-class="tap" @click="clickNumber(1)">1</view>
          <view class="num" hover-class="tap" @click="clickNumber(2)">2</view>
          <view class="num" hover-class="tap" @click="clickNumber(3)">3</view>
        </view>
        <view class="row">
          <view class="num" hover-class="tap" @click="clickNumber(4)">4</view>
          <view class="num" hover-class="tap" @click="clickNumber(5)">5</view>
          <view class="num" hover-class="tap" @click="clickNumber(6)">6</view>
        </view>
        <view class="row">
          <view class="num" hover-class="tap" @click="clickNumber(7)">7</view>
          <view class="num" hover-class="tap" @click="clickNumber(8)">8</view>
          <view class="num" hover-class="tap" @click="clickNumber(9)">9</view>
        </view>
        <view class="row">
          <view class="num" hover-class="tap" @click="clickDot">.</view>
          <view class="num" hover-class="tap" @click="clickNumber(0)">0</view>
          <view class="num" hover-class="tap" @click="removeText">
            <u-icon name="backspace" :size="28"></u-icon>
          </view>
        </view>
        <view class="row">
          <view class="num symbol" hover-class="tap" @click="clickSymbol('+')">
            +
          </view>
          <view class="num symbol" hover-class="tap" @click="clickSymbol('-')">
            -
          </view>
          <view class="num symbol" hover-class="tap" @click="clickSymbol('×')">
            ×
          </view>
        </view>
        <view class="row">
          <view class="num symbol" @click="clickSymbol('÷')"> ÷ </view>
          <view class="num" @click="clearText"> C </view>
          <view class="num" @click="calculate"> = </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { nextTick, ref, watch, watchEffect } from "vue";

const props = defineProps(["modelValue", "placeholder"]);
const emits = defineEmits(["update:model-value"]);

const value = ref(props.modelValue);
const onchange = (val) => {
  emits("update:model-value", val);
};

watchEffect(() => {
  value.value = props.modelValue;
});

const visible = ref(false);
const showKeybord = () => {
  visible.value = true;
};
const hideKeybord = () => {
  visible.value = false;
};

const symbolList = ["+", "-", "×", "÷"];
const result = ref(Number(value.value || 0));
const clickNumber = (number) => {
  value.value = value.value ? String(value.value) + number : number;
};
const clickDot = () => {
  const text = value.value ? String(value.value).trim() : "";
  const length = text?.length;
  if (!length || symbolList.includes(text[length - 1])) {
    value.value = value.value ? String(value.value) + "0." : "0.";
    return;
  }
  let isExistDot = false;
  for (let i = length - 1; i >= 0; i--) {
    const char = text[i];
    if (char === ".") {
      isExistDot = true;
      break;
    }
    if (symbolList.includes(char)) {
      break;
    }
  }
  if (isExistDot) return;
  value.value = value.value + ".";
};
const clickSymbol = (symbol) => {
  const text = value.value;
  const lastChar = text[text.length - 1];
  if (symbolList.includes(lastChar)) return;
  value.value = text + symbol;
};
const removeText = () => {
  const length = value.value?.length;
  if (length) {
    value.value = String(value.value).substring(0, length - 1);
  }
};
const clearText = () => {
  value.value = "";
};

function calculateExpression(expression) {
  // 去除字符串中可能存在的空格
  const text = expression.replace(/\s+/g, "");
  // 定义一个栈，用于存储操作数
  const numbers = [];
  // 用于存储运算符
  const symbols = [];
  // 定义一个变量，用于存储当前的运算符
  let num = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // 如果遇到了运算符号,则说明前序操作数已经拼接完成
    if (["+", "-", "*", "/"].includes(char)) {
      numbers.push(Number(num));
      symbols.push(char);
      num = "";
    } else {
      num = num + char;
    }
  }
  // 需要把最后的数字也放入到数组中
  if (num) {
    numbers.push(Number(num));
  }
  let result = numbers[0];
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];
    // 如果该运算符不是最后一个的话，需要看后一个是什么操作符
    if (i < symbols.length - 1) {
      // 当前运算符的后一个运算符
      const suffix = symbols[i + 1];
      // 如果后一个运算符的优先级比当前运算符优先级更高 比如 当前是 + 后一个是 * 则先计算后面的结果
      if (["+", "-"].includes(symbol) && ["*", "/"].includes(suffix)) {
        const temp = performOperation(numbers[i + 1], numbers[i + 2], suffix);
        symbols.splice(i + 1, 1);
        numbers.splice(i + 1, 2, temp);
        i--;
      } else {
        // 如果当前运算符的优先级不低于后一个运算符的优先级,则按顺序执行 即先执行当前运算
        result = performOperation(result, numbers[i + 1], symbol);
      }
    } else {
      // 如果是最后一个运算符，则直接运算即可
      result = performOperation(result, numbers[i + 1], symbol);
    }
  }
  return result;
}

function performOperation(a, b, operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    default:
      throw new Error("出现了未知的运算符号");
  }
}

const calculate = () => {
  if (!value.value?.length) {
    hideKeybord();
	return;
  }
  const expressions = String(value.value)
    .replaceAll("×", "*")
    .replaceAll("÷", "/");
  if (expressions.includes("/0")) {
    uni.showToast({
      icon: "error",
      title: "计算表达式错误,除数不能为0,请检查并修改后再试。",
      duration: 5000,
    });
    return;
  }
  try {
    let result = calculateExpression(expressions).toFixed(2);
    console.log(result, "result");
    while (result.length) {
      const lastChar = result[result.length - 1];
      if (lastChar === ".") {
        result = result.substring(0, result.length - 1);
        break;
      }
      if (lastChar !== "0") break;
      result = result.substring(0, result.length - 1);
    }
    value.value = result;
    hideKeybord();
  } catch (e) {
    console.log(e);
    uni.showToast({
      icon: "error",
      title: "计算表达式错误,请检查并修改后再试。",
      duration: 5000,
    });
    return;
  }
};
watch(value, (val) => {
  emits("update:model-value", val);
});

const close = () => {
  calculate();
};
const open = () => {
  value.value = props.modelValue || "";
};
</script>

<style lang="scss">
.text {
  line-height: 48rpx;
  font-size: 36rpx;
  color: #606266;
  word-break: break-word;
  background-color: #c8c9cc;
  padding: 48rpx;
  padding-top: 64rpx;
  padding-bottom: 0;
}

.keyword {
  width: 100%;
  min-height: 400rpx;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding: 48rpx;
  box-sizing: border-box;
  background-color: #c8c9cc;

  .row {
    height: 64rpx;
    display: flex;
    gap: 32rpx;

    .num {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      border-radius: 24rpx;
      box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);
      color: #303133;

      &.symbol {
        font-size: 40rpx;
      }

      &.tap {
        color: #fff;
        background-color: #2979ff;
      }
    }
  }
}
</style>
