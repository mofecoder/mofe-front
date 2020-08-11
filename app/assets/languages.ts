import { Language } from '~/types/language'

const languages: Language[] = [
  {
    innerName: 'cpp17_gcc10',
    name: 'C++17 (g++ 10.0.1)',
    mime: 'text/x-c++src'
  },
  {
    innerName: 'cpp20_gcc10',
    name: 'C++20 (g++ 10.0.1)',
    mime: 'text/x-c++src'
  },
  {
    innerName: 'c17_gcc10',
    name: 'C17 (gcc 10.0.1)',
    mime: 'text/x-csrc'
  },
  {
    innerName: 'python38',
    name: 'Python3 (3.8.2)',
    mime: 'text/x-python'
  },
  {
    innerName: 'cs_dotnet31',
    name: 'C# (.NET Core 3.1)',
    mime: 'text/x-csharp'
  },
  {
    innerName: 'cs_mono6',
    name: 'C# (Mono 6.10.0)',
    mime: 'text/x-csharp'
  },
  { innerName: 'java11', name: 'Java11 (11.0.6)', mime: 'text/x-java' },
  { innerName: 'go_114', name: 'Go (1.14)', mime: 'text/x-go' },
  {
    innerName: 'cpp17_gcc7',
    name: 'C++17 (g++ 7.4.0)',
    mime: 'text/x-c++src',
    isOutdated: true
  },
  {
    innerName: 'c11_gcc7',
    name: 'C11 (gcc 7.4.0)',
    mime: 'text/x-csrc',
    isOutdated: true
  },
  {
    innerName: 'python36',
    name: 'Python3 (3.6.9)',
    mime: 'text/x-python',
    isOutdated: true
  },
  {
    innerName: 'cs_mono6',
    name: 'C# (Mono 6.8.0)',
    mime: 'text/x-csharp',
    isOutdated: true
  }
]

export default languages
