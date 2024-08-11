<template>
  <view class="container">
    <view class="input-container">
      <u-input
        :placeholder="placeholder"
        v-model="text"
        @change="onchange"
        @blur="onBlur"
      ></u-input>
    </view>
    <view class="options" v-show="list.length > 0">
      <view
        class="option"
        v-for="item in list"
        :key="item"
        @click="handleSelect(item)"
        >{{ item }}</view
      >
    </view>
  </view>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted, watchEffect } from "vue";
const props = defineProps({
  options: {
    type: Array,
    default: [],
  },
  value: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "请输入",
  },
});
const emits = defineEmits(["select"]);
const text = ref(props.value);
const list = ref([]);
watch([() => props.options, text], ([options, val]) => {
  if (!Array.isArray(options) || !val) {
    list.value = [];
    return;
  }
  list.value = options.filter((v) => v.includes(val));
});

const handleSelect = (val) => {
  text.value = val;
  nextTick(() => {
    list.value = [];
    emits("select", val);
  });
};
const onchange = (val) => {
  emits("select", val);
};
const onBlur = (val) => {
  const timer = setTimeout(() => {
    list.value = [];
    clearTimeout(timer);
  }, 200);
};
const clear = () => {
  text.value = "";
};

defineExpose({
  clear,
  setText: handleSelect,
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: fit-content;
  position: relative;
  box-sizing: border-box;

  .input-container {
    width: 100%;
    height: 74rpx;
  }

  .options {
    width: 100%;
    height: fit-content;
    position: absolute;
    bottom: 80rpx;
    left: 0;
    z-index: 10086;

    .option {
      width: 100%;
      height: 74rpx;
      display: flex;
      align-items: center;
      background-color: #c8c9cc;
      padding: 6px 9px;
      box-sizing: border-box;
    }
  }
}
</style>
