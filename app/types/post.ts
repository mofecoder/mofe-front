export interface Post {
  id: number
  title: string
  content: string
  publicStatus: 'private' | 'public' | 'limited'
  createdAt: Date
  updatedAt: Date
}

export const STATUS_TABLE = {
  public: '公開',
  limited: '限定公開',
  private: '非公開'
}
