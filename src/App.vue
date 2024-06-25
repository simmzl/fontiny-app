<script setup lang="ts">
// Code by simmzl
import { ref, reactive, computed, onMounted } from "vue";

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
  if (!/\.ttf$/.test(name.toLowerCase())) return (errorMsg.value = "*请上传TTF格式文件");

  console.warn(input.files);
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

onMounted(() => {
  onDrag()
});
</script>

<template>
  <!-- Code by yy & simmzl -->
  <div class="wrapper" ref="dragger" id="dragger">
    <div class="top">
      <img src="./assets/logo2.png" class="logo" />
    </div>
    <div class="content">
      <div class="input">
        <div class="upload">
          <label for="file" class="center bt1 btn">上传字体包</label>
          <input type="file" id="file" @change="fileHandler" accept=".ttf" />
        </div>
        <div class="fontname">
          <span class="text1 err" v-if="errorMsg">{{ errorMsg }}</span>
          <span class="text1" v-else-if="!file.path">*仅支持ttf格式</span>
          <template v-else>
            <span class="text2">{{ file.name || "--" }}</span>
            <span class="text3">{{ fileSize }}</span>
          </template>
        </div>
      </div>
      <textarea placeholder="请在此粘贴所需字符" class="text5 word" v-model="fonts"></textarea>
      <div class="center bt2 btn" :class="{ disabled: !isValid }" @click="output">导出</div>
    </div>
  </div>
  <div class="drag-area" v-show="isDragging">
    <div class="drag-area-content">
      <h2>拖拽到该区域即可上传</h2>
      <span>*仅支持ttf格式</span>
    </div>
  </div>
</template>

<style src="./assets/reset.css"></style>

<style>
.wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
}

.drag-area {
  position: fixed;
  top: 0;
  left: 0;
  padding: 4px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 3;
  pointer-events: none;
  background: rgba(39, 212, 209, 0.2);
}

.drag-area-content {
  border-style: dashed;
  border-color: #27d4d1;
  height: 100%;
  width: 100%;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: none;
}

.drag-area-content h2 {
  color: #282828;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.drag-area-content span {
  color: #555555;
  font-size: 16px;
}

/* Code by yy */
.top {
  width: 100%;
  height: 38px;
  background-color: #27d4d1;
  display: flex;
  align-items: center;
  justify-content: end;
}

.logo {
  width: auto;
  height: 60%;
  margin-right: 8px;
;pointer-events: none;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  cursor: pointer;
  background-color: #27d4d1;
  transition: all .3s;
}

.btn:active {
  background: #1ec6c3;
}

.content {
  width: 100%;
  height: 100%;
  align-items: center;
}

.upload {
  position: relative;
  width: 120px;
  height: 38px;
  margin: 0 auto;
}

.upload input {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  cursor: pointer;
}

.upload .btn {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  font-size: 12px;
  border-radius: 6px;
  z-index: 2;
  cursor: pointer;
}

.bt1 {
  width: 102px;
  height: 38px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.bt2 {
  width: 144px;
  height: 48px;
  margin: 46px auto 56px auto;
  border-radius: 24px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 4px;
  padding-left: 4px;
}

.bt2.disabled {
  background-color: #d6d6d6;
}

.fontname {
  width: 256px;
  height: 38px;
  border-radius: 8px;
  margin-left: 8px;
  padding-left: 14px;
  padding-right: 14px;
  font-size: 14px;
  font-weight: 400;
  background-color: #efefef;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text1 {
  color: #c4c4c4;
  letter-spacing: 1px;
}

.err {
  color: #fe6063;
  letter-spacing: 0;
}

.text2 {
  color: #282828;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text3 {
  flex-shrink: 0;
  color: #b1b1b1;
  margin-left: 8px;
}

.input {
  width: 366px;
  height: 38px;
  margin: 56px auto 46px auto;
  display: flex;
}

.word {
  width: 366px;
  height: 50vh;
  border-radius: 8px;
  margin: 0px auto;
  padding: 18px 18px 18px 18px;
  border-color: #27d4d1;
  border-width: 1px;
  background-color: #f5f5f5;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 1px;
  display: block;
}

.text5 {
  color: #282828;
  text-align: justify;
}

.text5::placeholder {
  color: #b1b1b1;
}
</style>
