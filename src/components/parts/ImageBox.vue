<template>
  <component
    v-if="image"
    :is="tag"
    class="image-box"
  >
    <div class="image-box__wrapper">
      <slot>
        <figure class="image-box__image">
          <a
            :href="image.image_url || '#'" 
            target="_blank"
            class="image-box__link"
          >
              <img
                v-lazy="image.image_url"
                :alt="image.image_url"
              />
          </a>
        </figure>

        <span class="image-box__name">{{ image.display_sitename }}</span>
      </slot>
    </div>
  </component>
</template>

<script lang="ts" setup>
  //#region import
  import { PropType, computed } from 'vue';
  import type { ImageResponse } from '@/interfaces/api.types';
  //#endregion

  //#region props
  type TagKey = 'li' | 'div';

  interface Props {
    modelValue: ImageResponse;
    tag: TagKey;
  }
  const props = defineProps({
    modelValue: {
      type: Object as PropType<Props['modelValue']>,
      required: true,
    },

    tag: {
      type: String as PropType<Props['tag']>,
      default: 'li',
      required: false,
    },
  });
  //#endregion

  //#region 본문
  const image = computed(() => props.modelValue);
  //#endregion
</script>

<style scoped lang="scss">
  .image-box {
    &__wrapper {
      border: 1px solid $borderGrey;
      border-radius: rem(4px);
    }

    &__image {
      overflow: hidden;
      width: 100%;
      @include imageResize('auto');

      &:after {
        content: '';
        display: block;
        padding-bottom: 100%;
      }

      img {
        object-fit: contain;
        max-width: 100%;
        max-height: 100%;
      }
    }

    &__link {
      display: block;
    }

    &__name {
      border-top: 1px solid $borderGrey;
      padding: rem(8px 16px);
      @include fontcss($black, 400, rem(12px));
      @include line(3);
    }
  }
</style>
