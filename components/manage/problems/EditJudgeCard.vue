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
        デフォルトチェッカーまたはカスタムチェッカーを利用することができます。
      </p>
      <p class="body1">
        デフォルトチェッカーは
        <a
          href="https://github.com/MikeMirzayanov/testlib/blob/master/checkers"
          target="_blank"
          >testlib のサンプル</a
        >
        を利用しています。
      </p>
      <p class="body1">
        カスタムチェッカーを利用する場合は，testlib を使って作成してください。
        (サンプルを参考にしてください)
      </p>
    </v-alert>

    <v-expansion-panels class="mb-4">
      <v-expansion-panel class="description">
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
      <v-expansion-panel class="description">
        <v-expansion-panel-title
          >カスタムチェッカーの独自動作について（動的点数設定など）</v-expansion-panel-title
        >
        <v-expansion-panel-text>
          <v-alert
            class="mb-2"
            variant="tonal"
            title="動的点数設定（β）について"
            type="warning"
          >
            次の方法で、テストケースセットごとの点数を動的に設定できます。<br />
            <ol class="mt-1 mb-2">
              <li>
                テストケースセットの「集計方法」を「合計」「最大」「最小」のいずれかに設定する。
              </li>
              <li>
                カスタムチェッカーを選択し、チェッカーでは標準出力に
                <code>MofeJudge::Score(0)</code>
                を1行で出力する。（<code>0</code> の部分に点数を入れる）
              </li>
            </ol>
            「合計」の場合はセット内のテストケースに対する点数の合計値、
            「最大」では最大値、「最小」では最小値が点数になります。<br />
            出力しなかったケースについては集計対象外となり、対象ケースが 1
            つも存在しない場合には 0 点となります。<br />
            設定した配点については表示のみとなり、集計には利用されません。
            （設定によっては点数が配点を超えることがあります）。<br />
            提出自体に対する点数は、テストケースセットごとの点数の合計です。<br />
            ※複数回出力したときの動作は未定義です。
          </v-alert>
          <v-alert class="mb-4" variant="tonal" color="info">
            カスタムチェッカーにて標準出力に
            <code>MofeJudge::Status(QLE)</code>
            と1行に出力すると、テストケースの結果を QLE にすることができます。
            （そのほかに OLE と WA に対応）<br />
            ※複数回出力したときの動作は未定義です。
          </v-alert>
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
        コンパイル時間短縮のため、無駄なヘッダー (特に
        <code>bits/stdc++.h</code>) の include は控えてください。
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
