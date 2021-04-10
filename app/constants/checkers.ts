interface CheckerType {
  value: string
  fileName: string
  description: string
}

export default [
  { value: 'tokens', fileName: 'wcmp.cpp', description: 'トークンの完全一致' },
  { value: 'lines', fileName: 'fcmp.cpp', description: '行の完全一致' },
  {
    value: 'line_tokens',
    fileName: 'lcmp.cpp',
    description: '行ごとのトークン完全一致'
  },
  { value: 'integers', fileName: 'ncmp.cpp', description: '整数列の完全一致' },
  {
    value: 'integers_ignore_order',
    fileName: 'uncmp.cpp',
    description: '整数列の順序無視一致'
  },
  {
    value: 'yesno_single',
    fileName: 'yesno.cpp',
    description: 'YesNo 一致 (単一トークン)'
  },
  {
    value: 'yesno',
    fileName: 'nyesno.cpp',
    description: 'YesNo 一致 (複数トークン)'
  },
  {
    value: 'double4',
    fileName: 'rcmp4.cpp',
    description: '絶対・相対誤差  [誤差 ≦ 10^(-4)] (複数トークン)'
  },
  {
    value: 'double6',
    fileName: 'rcmp6.cpp',
    description: '絶対・相対誤差  [誤差 ≦ 10^(-6)] (複数トークン)'
  },
  {
    value: 'double9',
    fileName: 'rcmp9.cpp',
    description: '絶対・相対誤差  [誤差 ≦ 10^(-9)] (複数トークン)'
  },
  {
    value: 'double_absolute',
    fileName: 'rncmp.cpp',
    description: '絶対誤差  [誤差 ≦ 10^(-9)] (複数トークン)'
  },
  {
    value: 'double_absolute_single',
    fileName: 'acmp.cpp',
    description: '絶対誤差 [誤差 ≦ 1.5 × 10^(-6)] (単一トークン)'
  },
  {
    value: 'double_single',
    fileName: 'dcmp.cpp',
    description: '絶対・相対誤差  [誤差 ≦ 10^(-6)] (単一トークン)'
  },
  {
    value: 'huge_integer',
    fileName: 'hcmp.cpp',
    description: '符号付きの大きな整数の一致'
  },
  { value: 'int', fileName: 'icmp.cpp', description: 'int 型の数値一致' }
] as CheckerType[]
