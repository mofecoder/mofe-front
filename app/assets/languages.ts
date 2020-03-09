import { Language } from '~/types/language'

const languages: Language[] = [
  { innerName: 'cpp17_gcc7', name: 'C++17 (g++ 7.4.0)', mime: 'text/x-c++src' },
  { innerName: 'c11_gcc7', name: 'C11 (gcc 7.4.0)', mime: 'text/x-csrc' },
  { innerName: 'python36', name: 'Python3 (3.6.9)', mime: 'text/x-python' },
  { innerName: 'cs_mono6', name: 'C# (Mono 6.8.0)', mime: 'text/x-csharp' },
  { innerName: 'java11', name: 'Java11 (11.0.6)', mime: 'text/x-java' },
  { innerName: 'go_114', name: 'Go (1.14)', mime: 'text/x-go' }
]

export default languages
