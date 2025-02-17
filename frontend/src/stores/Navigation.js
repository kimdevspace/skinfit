//헤더- 검색에 있어서 뒤로가기 설정
import { create } from 'zustand'

export const useNavigateStore = create((set) => ({
    searchHistory : [], // 검색이력,
    setSearchHistory: (history) => set({searchHistory : history}),
    addSearchHistory: (search) => 
        set((state) => ({
            searchHistory: [...state.searchHistory, search]
        }))
})
)


