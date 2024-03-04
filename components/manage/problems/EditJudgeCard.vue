<script setup lang="ts">
import checkersRaw from '~/constants/checkers'
import ManageProblems from '~/utils/apis/ManageProblems'

const emits = defineEmits<{
  update: []
}>()

const checkers = checkersRaw.map((c) => ({
  title: `${c.description} (${c.fileName})`,
  value: c.value
}))
checkers.push({ title: 'カスタムチェッカー', value: 'custom' })

const checker = ref<string>('')
const file = ref<File | null>()

const props = defineProps<{
  problemId: number
}>()

const { data: problem } = await useApi(ManageProblems.getProblem, [
  props.problemId
])
const checkerPath = problem.value?.checkerPath
if (checkerPath) {
  const c = checkersRaw.find((c) => c.fileName === checkerPath.split('/')[1])
  checker.value = c ? c.value : 'custom'
}

const updateFile = (f: File | null) => (file.value = f)

const submit = async () => {
  if (checker.value === 'custom' && !file.value) {
    alert('カスタムチェッカーファイルを選択してください')
    return
  }
  const formData = new FormData()
  const type = checkersRaw.find((c) => c.value === checker.value)?.fileName
  if (type) formData.append('type', type)
  if (file.value) formData.append('file', file.value)
  await useApi(ManageProblems.updateChecker, [props.problemId], {}, formData)
  emits('update')
}
</script>

<template>
  <v-container>
    <v-alert class="mb-2" variant="tonal" type="info">
      <v-alert-title>ジャッジの設定方法</v-alert-title>
      <p class="body1">
        デフォルトチェッカーまたはカスタムチェッカーを利用することができます．
      </p>
      <p class="body1">
        デフォルトチェッカーは
        <a
          href="https://github.com/MikeMirzayanov/testlib/blob/master/checkers"
          target="_blank"
          >testlib のサンプル</a
        >
        を利用しています．
      </p>
      <p class="body1">
        カスタムチェッカーを利用する場合は，testlib を使って作成してください．
        (サンプルを参考にしてください)
      </p>
    </v-alert>
    <v-alert class="mb-4" variant="outlined" type="warning">
      現時点では、チェッカーにより動的に点数やジャッジ結果（QLE,
      OLEなど）を設定することはできません。<br />
      チェッカーでは AC / WA の判定のみ行うことができます。
    </v-alert>

    <v-expansion-panels>
      <v-expansion-panel class="description mb-4">
        <v-expansion-panel-title>用語の説明</v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="body2">
            「チェッカー」:ユーザのプログラムの出力に対して，正誤を判定するプログラムのこと.
          </p>
          <p class="body2">
            「トークン」:
            出力の文字列を空白区切りで分けた，それぞれの項目のこと．
          </p>
          <p class="body2">
            トークンに分ける際，空白の種類の違いは無視されます．
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-select
      v-model="checker"
      class="select-checker"
      :items="checkers"
      label="チェッカーを選択"
    />
    <template v-if="checker === 'custom'">
      <p class="body2">
        コンパイル時間短縮のため，無駄なヘッダー (特に
        <code>bits/stdc++.h</code>) の include は控えてください．
      </p>
      <v-file-input
        placeholder="チェッカーファイルをアップロード"
        accept=".cc,.cpp"
        @change="updateFile($event.target.files[0] || null)"
      />
    </template>
    <v-btn color="primary" @click="submit">確定</v-btn>
  </v-container>
</template>

<style scoped lang="scss"></style>
