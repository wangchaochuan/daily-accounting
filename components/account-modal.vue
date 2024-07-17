<template>
  <u-popup
    :show="visible"
    :closeable="true"
    :closeOnClickOverlay="false"
    :round="24"
    @close="close"
    @open="open"
  >
    <view class="content">
      <view class="title">{{
        mode === "create" ? "新增账目" : "修改账目"
      }}</view>
      <view class="type">
        <u-radio-group
          v-model="type"
          name="type"
          @change="changeType"
          :disabled="mode === 'edit'"
        >
          <u-radio
            label="支出"
            name="expend"
            customStyle="margin-right:16rpx"
          ></u-radio>
          <u-radio label="收入" name="income"></u-radio>
        </u-radio-group>
      </view>
      <view class="classify">
        <view class="label">选择分类</view>
        <classify-component
          :list="classifyList"
          v-model="classify"
        ></classify-component>
      </view>
      <u-form labelPosition="left" :model="model" :rules="rules" ref="formRef">
        <u-form-item
          label="日期"
          prop="date"
          required
          @click="showDatePicker = true"
        >
          <view class="date-text">
            <u-text mode="date" :text="model.date" line-height="38px"></u-text>
          </view>
        </u-form-item>
        <u-form-item label="金额" prop="amount" required>
          <u-input
            type="digit"
            placeholder="请输入金额"
            v-model="model.amount"
          ></u-input>
        </u-form-item>
        <u-form-item label="标签" prop="tag">
          <u-input placeholder="请输入标签" v-model="model.tag"></u-input>
        </u-form-item>
        <u-form-item label="备注" prop="remark">
          <u-input placeholder="请输入备注" v-model="model.remark"></u-input>
        </u-form-item>
      </u-form>
      <view class="footer">
        <u-button class="cancel" type="error" shape="circle" @click="cancel"
          >取消</u-button
        >
        <u-button class="confirm" type="primary" shape="circle" @click="confirm"
          >确定</u-button
        >
      </view>
      <u-datetime-picker
        mode="date"
        :show="showDatePicker"
        v-model="model.date"
        :min-date="minDate"
        :max-date="today"
        @cancel="closePicker"
        @close="closePicker"
        @confirm="closePicker"
      ></u-datetime-picker>
    </view>
  </u-popup>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import dayjs from "dayjs";
import classifyComponent from "./classify.vue";
import useUserStore from "@/store/user.js";
import useBookStore from "@/store/book.js";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "create",
  },
  data: {
    type: Object,
    default: () => ({}),
  },
});
const CO = uniCloud.importObject("account-co");
const userStore = useUserStore();
const bookStore = useBookStore();
const bookId = computed(() => bookStore.bookId);
const userId = computed(() => userStore.user._id);
const expendClassifyList = computed(() => {
  if (!bookStore.currentBook) return [];
  return bookStore.currentBook.expendClassify;
});
const incomeClassifyList = computed(() => {
  if (!bookStore.currentBook) return [];
  return bookStore.currentBook.incomeClassify;
});
const emits = defineEmits(["close", "success"]);
const type = ref("expend");
const showDatePicker = ref(false);
const changeType = (value) => {
  if (value === "expend") {
    classifyList.value = expendClassifyList.value;
    classify.value = expendClassifyList.value?.[0];
  } else {
    classifyList.value = incomeClassifyList.value;
    classify.value = incomeClassifyList?.value?.[0];
  }
};
const classifyList = ref([]);
const classify = ref("");
const today = dayjs().valueOf();
const minDate = dayjs().subtract(3, "year").valueOf();
const formRef = ref(null);
const model = reactive({
  date: today,
  amount: undefined,
  tag: "",
  remark: "",
});
const rules = {
  amount: [
    {
      type: "number",
      required: true,
      message: "请输入金额",
      trigger: ["blur", "change"],
    },
  ],
};

const close = () => {
  emits("close");
};

const cancel = () => {
  close();
};
const closePicker = () => {
  showDatePicker.value = false;
};
const reset = () => {
  type.value = "expend";
  classify.value = expendClassifyList.value?.[0];
  model.date = today;
  model.amount = undefined;
  model.tag = "";
  model.remark = "";
};
const confirm = async () => {
  await formRef.value?.validate();
  const params = {
    type: type.value,
    classify: classify.value,
    date: dayjs(model.date).format("YYYY-MM-DD"),
    amount: Number(model.amount),
    tag: model.tag,
    remark: model.remark,
  };
  if (props.mode === "create") {
    const data = {
      ...params,
      datetime: dayjs(model.date).valueOf(),
      bookId: bookId.value,
      creator: userId.value,
      createTime: dayjs().format("YYYY-MM-DD HH:mm"),
      updater: userId.value,
      updateTime: dayjs().format("YYYY-MM-DD HH:mm"),
    };
    const response = await CO.creatRecord(data);
    if (response?.data?.id) {
      uni.$emit("changeMonthTotal", {
        type: type.value,
        amount: params.amount,
      });
    }
  } else {
    const data = {
      ...params,
      datetime: dayjs().valueOf(),
      updater: userId.value,
      updateTime: dayjs().format("YYYY-MM-DD HH:mm"),
    };
    const record = props.data;
    const response = await CO.updateRecord(record._id, data);
    if (response.data.affectedDocs) {
      uni.$emit("changeMonthTotal", {
        type: type.value,
        amount: params.amount - record.amount,
      });
    }
  }
  emits("success");
  reset();
  close();
};

const open = () => {
  if (props.mode === "edit") {
    const data = props.data;
    changeType(data.type);
    type.value = data.type;
    classify.value = data.classify;
    model.date = data.date;
    model.amount = data.amount;
    model.tag = data.tag;
    model.remark = data.remark;
  } else {
    classifyList.value = expendClassifyList.value;
    classify.value = expendClassifyList.value?.[0];
  }
};

onMounted(() => {
  formRef.value?.setRules(rules);
});
</script>

<style lang="scss">
.content {
  height: fit-content;
  min-height: 240rpx;
  padding: 0 24rpx 16px 16px;

  .title {
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16rpx;
  }

  .type {
    margin-bottom: 16rpx;
  }

  .date-text {
    width: 100%;
    border-width: 0.5px !important;
    border-style: solid;
    border-color: #dadbde;
    padding-left: 9px;
  }

  .classify {
    margin-bottom: 16px;

    .label {
      color: $u-content-color;
      margin-bottom: 8rpx;
    }
  }

  .footer {
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
    margin-top: 36rpx;
  }
}
</style>
