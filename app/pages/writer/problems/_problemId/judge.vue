<template>
  <v-container>
    <v-btn class="mb-3" nuxt to=".." append text color="purple"
      >問題編集に戻る</v-btn
    >
    <h2 class="heading3 mb-4">ジャッジの設定</h2>
    <details class="description mb-4">
      <summary>用語の説明</summary>
      <p class="body2">
        「チェッカー」:ユーザのプログラムの出力に対して，正誤を判定するプログラムのこと.
      </p>
      <p class="body2">
        「トークン」: 出力の文字列を空白区切りで分けた，それぞれの項目のこと．
      </p>
      <p class="body2">トークンに分ける際，空白の種類の違いは無視されます．</p>
    </details>
    <p class="body1">
      デフォルトチェッカーまたはカスタムチェッカーを利用することができます．
    </p>
    <p class="body1">
      デフォルトチェッカーは
      <a href="https://github.com/MikeMirzayanov/testlib/blob/master/checkers"
        >testlib のサンプル</a
      >
      を利用しています．
    </p>
    <p class="body1">
      カスタムチェッカーを利用する場合は，testlib を使って作成してください．
      (サンプルを参考にしてください)
    </p>
    <v-select
      v-model="checker"
      class="select-checker"
      :items="items"
      label="チェッカーを選択"
    />
    <template v-if="checker === 'custom'">
      <p class="body2">
        コンパイル時間短縮のため，無駄なヘッダー (特に
        <code>bits/stdc++.h</code>) の include は控えてください．
      </p>
      <v-file-input
        v-model="file"
        placeholder="チェッカーファイルをアップロード"
        accept=".cc,.cpp"
      />
    </template>
    <v-btn color="primary" @click="submit">確定</v-btn>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import checkers from '~/constants/checkers'
import { ProblemDetail } from '~/types/problems'

const checkersList = checkers.map((c) => ({
  text: `${c.description} (${c.fileName})`,
  value: c.value
}))
checkersList.push({ text: 'カスタムチェッカー', value: 'custom' })

@Component({ middleware: 'authenticated' })
export default class PageWriterTaskJudge extends Vue {
  problem: ProblemDetail | null = null
  items = checkersList
  file: File | null = null
  checker: string = ''

  head() {
    return {
      title: `[${this.problemId}] ジャッジの設定`
    }
  }

  validate({ params }: { params: { [_: string]: string } }): boolean {
    return /^[1-9]\d*$/.test(params.problemId)
  }

  async created() {
    await this.$fetch()
  }

  async fetch() {
    const problem = await this.$api.Problems.show(this.problemId)
    this.problem = problem
    if (!problem.checkerPath) return
    const checker = checkers.filter(
      (c) => c.fileName === problem.checkerPath!.split('/')[1]
    )[0]
    this.checker = checker ? checker.value : 'custom'
  }

  get problemId(): number {
    return Number(this.$route.params.problemId)
  }

  async submit() {
    if (this.checker === 'custom' && !this.file) {
      alert('チェッカーファイルを選択してください')
      return
    }
    await this.$api.Problems.updateChecker(
      this.problemId,
      checkers.filter((c) => c.value === this.checker)[0]?.fileName,
      this.file
    )
  }
}
</script>

<style lang="scss">
.description {
  max-width: 30rem;
  padding: 6px;
  border: solid 1px #444444;
  border-radius: 4px;
}

.select-checker {
  max-width: 32rem;
}
</style>
