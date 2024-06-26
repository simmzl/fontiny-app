<!-- Products crafted with love by YY and Simmzl." -->
<template>
  <div class="wrapper" ref="dragger" id="dragger">
    <header>
      <div @click="onToggle" class="logo"></div>
    </header>
    <main>
      <section class="section-import">
        <div class="import">
          <label for="file" class="import-btn center btn">拖拽上传字体包</label>
          <input type="file" id="file" class="import-input" @change="fileHandler" accept=".ttf" />
        </div>
        <div class="info">
          <span class="info-tip info-error" v-if="errorMsg">{{ errorMsg }}</span>
          <span class="info-tip" v-else-if="!file.path">*仅支持ttf格式</span>
          <template v-else>
            <span class="info-name">{{ file.name || "--" }}</span>
            <span class="info-size">{{ fileSize }}</span>
          </template>
        </div>
      </section>
      <textarea class="section-textarea" placeholder="请在此输入所需字符" v-model="fonts"></textarea>
      <section class="section-export center btn" :class="{ disabled: !isValid }" @click="output">导出</section>
    </main>
  </div>
  <div class="drag-area" v-show="isDragging">
    <div class="drag-area-content">
      <h2>松开即可上传</h2>
      <span>*仅支持ttf格式</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { toggleTheme } from "./utils";

const fonts = ref("");
let errorMsg = ref("");
const file = reactive({
  name: "",
  size: 0,
  path: "",
});
const isDragging = ref(false);
const dragger = ref<HTMLAreaElement | null>(null);

const isValid = computed(() => !!fonts.value && !errorMsg.value && file.path);

const fileSize = computed(() =>
  file.size === 0 ? "--" : `${(file.size / 1000000).toFixed(3)}MB`
);

const fileHandler = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files || !input.files.length) return;
  console.warn(input.files.length);
  const { name, path, size } = input.files[0] as any;
  errorMsg.value = "";
  if (!/\.ttf$/.test(name.toLowerCase())) {
    return (errorMsg.value = "*请上传ttf格式文件");
  } else {
    errorMsg.value = "";
  }

  console.warn(111, input.files);
  file.name = name;
  file.path = path;
  file.size = size;
  console.warn(file);
  upload();
};

const output = () => {
  if (!isValid.value) return;
  window.fontTiny.compress(fonts.value);
};

const upload = () => {
  console.warn("upload", file);
  window.fontTiny.upload(file.path, file.name);
};

const onDrag = () => {
  let counter = 0;

  if (!dragger.value) return;
  dragger.value.addEventListener("dragenter", () => {
    counter++;
    if (counter === 1) {
      console.log('dragenter');
      if (!isDragging.value) isDragging.value = true;
    }
  });
  dragger.value.addEventListener("dragleave", () => {
    counter--;
    if (counter === 0) {
      console.log('dragleave');
      if (isDragging.value) isDragging.value = false;
    }
  });

  //添加拖拽事件监听器
  dragger.value.addEventListener("drop", (e) => {
    counter = 0;
    console.log('drop:', e);
    if (isDragging.value) isDragging.value = false;
    e.preventDefault();
    //获取文件列表
    const files = e.dataTransfer?.files;
    console.log('files:', files, e);

    if (files && files.length > 0) {
      //获取文件路径
      // @ts-ignore
      const path = files[0].path;
      console.log('path:', path, files[0].name);
      if (!/\.ttf$/.test(files[0].name.toLowerCase())) return (errorMsg.value = "*请上传TTF格式文件");
      else errorMsg.value = "";
      file.name = files[0].name;
      file.path = path;
      file.size = files[0].size;
      upload();
    }
  })

  //阻止拖拽结束事件默认行为
  dragger.value.addEventListener("dragover", (e) => {
    e.preventDefault();
  })
}

const onToggle = (e: MouseEvent) => {
  toggleTheme();

  console.log('click');
  e.preventDefault();
};

onMounted(() => {
  onDrag()
});
</script>

<style src="./assets/css/reset.css"></style>

<style lang="scss" src="./assets/css/index.scss"></style>
