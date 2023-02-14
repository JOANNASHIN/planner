<template>
  <div class="image-list">
    <!-- 1: 리스트 있는 경우 -->
    <template v-if="imageList.length">
      <ul class="image-list__wrapper">
        <template
          v-for="(image, index) in imageList"
          :key="`${index}-${image.image_url}`"
        >
          <slot>
            <ImageBoxComponent
              class="image-list__box"
              v-model="imageList[index]"
            ></ImageBoxComponent>
          </slot>
        </template>
      </ul>
    </template>

    <!-- 2: 리스트 없는 경우 -->
    <template v-else>
      <div class="image-list__empty">
        <p class="image-list__empty__text">검색된 리스트가 없습니다.</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  //#region component
  import ImageBoxComponent from '@/components/parts/ImageBox.vue';
  //#endregion

  //#region import
  import { PropType, computed } from 'vue';
  import type { ImageResponse } from '@/interfaces/api.types';
  //#endregion

  //#region props
  interface Props {
    modelValue: ImageResponse[];
  }

  const props = defineProps({
    modelValue: {
      type: Array as PropType<Props['modelValue']>,
      required: true,
    },
  });
  //#endregion

  //#region 본문
  const imageList = computed(() => props.modelValue);
  //#endregion
</script>

<style scoped lang="scss">
  .image-list {
    &__wrapper {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
      font-size: 0;
      margin: rem(-6px -4px);
    }

    &__box {
      flex: 0 0 50%;
      padding: rem(6px 4px);
      box-sizing: border-box;
    }

    &__empty {
      padding: rem(120px 0);
      text-align: center;

      &__text {
        @include fontcss($textGrey, 400, rem(13px));
      }
    }
  }
</style>
