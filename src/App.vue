<script setup lang="ts">
import { ref, reactive, computed } from "vue"

const fonts = ref("")
let errorMsg = ref("")
const file = reactive({
  name: "",
  size: 0,
  path: ""
})

const isValid = computed(
  () => !!fonts.value
);

const fileSize = computed(
  () => file.size === 0 ? "--" : `${(file.size / 1000000).toFixed(2)}M`
);

const fileHandler = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files || !input.files.length) return
  console.warn(input.files.length)
  const { name, path, size } = input.files[0] as any
  errorMsg.value = ""
  if (!/.ttf$/.test(name)) return errorMsg.value = "请选择ttf文件"

  console.warn(input.files)
  file.name = name
  file.path = path
  file.size = size
  console.warn(file)
  upload()
}

const output = () => {
  if (!isValid.value) return
  window.fontTiny.compress(fonts.value)
}

const upload = () => {
  window.fontTiny.upload(file.path, file.name)
}
</script>

<template>
  <section class="top">
    <div class="input">
      <label for="file" class="btn input-font">选择TTF文件</label>
      <input type="file" id="file" @change="fileHandler">
    </div>

    <div class="info">
      <p class="error">{{errorMsg}}</p>
      <p>已选择文件：{{file.name || "--"}}</p>
      <p>源文件大小：{{fileSize}}</p>
    </div>
  </section>

  <section class="textarea">
    <textarea cols="30" rows="10" v-model="fonts" placeholder="请输入要保留的文字"></textarea>
  </section>

  <section class="bottom">
    <div class="btn output" :class="{ disabled: !isValid }" @click="output">导出</div>
  </section>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  user-select: none;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 40px;
  border-radius: 6px;
  background: #25d4d0;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
}

.btn:hover {
  background: #13dad6;
}

.btn.disabled {
  background: gray;
  cursor: not-allowed;
}

.output {
  margin: 20px auto;
}

.input {
  position: relative;
  width: 120px;
  height: 40px;
  margin: 0 auto;
}

.input input {
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

.input-font {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  font-size: 12px;
  border-radius: 6px;
  background: #25d4d0;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
}

.info {
  font-size: 12px;
  text-align: center;
}

.info p {
  margin: 6px 0;
}

section {
  margin: 20px 0;
}

textarea {
  width: 400px;
  height: 200px;
  padding: 10px 13px 10px 10px;
  margin: 15px 20px;
  border: 2px solid #25d4d0;
  border-radius: 6px;
  font-size: 12px;
  line-height: 23px;
  color: #282828;
}

textarea::placeholder {
  font-size: 12px;
  line-height: 23px;
  color: #474747;
}

.error {
  color: #fe6063;
}
</style>
