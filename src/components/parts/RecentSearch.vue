<template>
  <!-- 최근 검색 레이어 -->
  <div
    v-if="hasSearched"
    class="recent-search"
  >
    <div class="recent-search__cont">
      <!-- 최근 검색어 리스트 -->
      <ol class="recent-search__list">
        <template
          v-for="(word, index) in recentList"
          :key="`word${index}`"
        >
          <li
            class="recent-search__word"
            v-if="index < recentWordMaxCount"
          >
            <span>{{ word }}</span>
          </li>
        </template>
      </ol>

      <div class="recent-search__bottom">
        <button
          type="button"
          class="recent-search__delete"
          @click.stop="deleteRecentWord()"
        >
          최근 검색어 삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  //#region import
  import { PropType, computed, ref, watch, onMounted } from 'vue';
  import type { RecentSearchModel } from '@/interfaces/app.types';
  //#endregion

  //#region emits & props
  const emit = defineEmits<{
    (e: 'update:modelValue', data: RecentList): void,
    (e: 'update'): void,
    (e: 'delete'): void,
  }>();

  type RecentList = RecentSearchModel['list'];

  interface Props {
    modelValue: RecentList;
  }

  const props = defineProps({
    modelValue: {
      type: Array as PropType<Props['modelValue']>,
      required: true,
    },
  });
  //#endregion

  //#region 최근 검색
  /**
   * store key
   */
  const StoreKey = 'RecentSearch' as const;

  /**
   * 최근검색 modelValue
   */
  const recentList = computed<RecentList>({
    get: () => props.modelValue,
    set: (newValue) => {
      emit('update:modelValue', newValue);
    },
  });

  /**
   * 최근검색 값 변경 감지
   */
  watch(
    () => props.modelValue,
    (newValue) => {
      updateRecentSearch(newValue);
    },
  );

  /**
   * 최근검색 최대 노출 개수
   */
  const recentWordMaxCount = ref(10);

  /**
   * 최근검색여부
   */
  const hasSearched = computed(() => !!recentList.value.length);

  /**
   * 최근 검색어 업데이트 event
   */
  const updateRecentSearch = (newValue: RecentList) => {
    const mergeWords = new Set(newValue);
    const saveData = [...mergeWords];

    // 로컬스토리지 업데이트
    window.localStorage.setItem(StoreKey, JSON.stringify(saveData));

    emit('update');
  };

  /**
   * 최근 검색어 삭제
   */
  const deleteRecentWord = () => {
    const deleteConfirm = window.confirm('최근검색어를 삭제하시겠습니까?');
    if (!deleteConfirm) return;

    window.localStorage.removeItem(StoreKey);
    recentList.value = [];

    emit('delete');

    alert('삭제되었습니다.');
  };

  /**
   * 최근 검색어 가져오기
   */
  const getRecentSearch = () => {
    const hasHistory = window.localStorage.getItem(StoreKey);

    if (hasHistory) return JSON.parse(hasHistory);
    else return [];
  };

  /**
   * 최근 검색어 init
   */
  const setRecentSearch = () => {
    const prev = getRecentSearch();

    // 리스트 업데이트
    recentList.value = prev;
  };

  //#endregion

  //#region mount
  onMounted(() => {
    setRecentSearch();
  });
  //#endregion
</script>

<style scoped lang="scss">
  .recent-search {
    width: 100%;
    background: $white;
    border: 1px solid $borderGrey;
    border-radius: rem(4px);
    box-sizing: border-box;

    &__cont {
      margin: rem(-4px 0);
      padding: rem(20px);
    }

    &__list {
      display: block;
      overflow: auto;
      max-height: rem(200px);
      margin: rem(4px 0);
    }

    &__word {
      @include fontcss($textGrey, 400, rem(13px), 1.4);
      @include line(1);
    }

    &__bottom {
      margin-top: rem(10px);
    }

    &__delete {
      background: $white;
      border: 1px solid $borderGrey;
    }
  }
</style>
