<template>
  <div class="vz-data-table" :class="{ 'vz-data-table--row-clickable': rowClickable && !loading, 'vz-data-table--loading': loading }">
    <vz-search-panel v-if="$slots['search-panel']" @clear="onClear" @search="onSearch">
      <slot name="search-panel" :errors="serverErrors" />
    </vz-search-panel>

    <template v-if="items.length">
      <vz-card class="vz-data-table__table-container">
        <table>
          <thead>
            <tr>
              <td v-for="({ title, value, style }, index) in headers" :key="index" :class="{ [`vz-data-table__data-${value}`]: true }">
                <div>
                  <span :style="style">{{ $t(title) }}</span>
                </div>
              </td>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, itemIndex) in items" :key="itemIndex" @click="onRowClick(item)">
              <td
                v-for="({ value, style }, columIndex) in headers"
                :key="columIndex"
                :class="{ [`vz-data-table__data-${value}`]: true }"
                :style="style"
              >
                <slot v-if="$slots[value]" :item="item" :item-index="itemIndex" :col-index="columIndex" :name="value" />

                <span v-else>{{ get(item, value) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </vz-card>

      <vz-tab-switcher v-model:index="vPage" :tabs="totalItems || 0" num-of-shown="4" />
    </template>

    <vz-card v-else class="vz-data-table vz-data-table--no-data">
      <vz-spinner v-if="loading" class="vz-data-table vz-data-table--no-data" size="128" />

      <template v-else>
        <img :src="require(`@/assets/images/${noDataImage || defaultNoDataImage}.svg`)" :alt="$t(noDataText || defaultNoDataText)" />

        <vz-error-alert v-if="errors?.errorMessage?.length" :errors="errors"></vz-error-alert>

        <p v-else>{{ $t(noDataText || defaultNoDataText) }}</p>

        <slot name="no-data" />
      </template>
    </vz-card>
  </div>
</template>

<script setup lang="ts">
import type { TableHeader } from '@/shared/components/tables/models/table-header';
import type { ErrorResponse } from '@/shared/services/api-service/models';
import { computed, PropType, ref } from 'vue';
import { get } from 'lodash';
import { useServerErrorsMapper } from '@/shared/composables';

const props = defineProps({
  headers: { type: Array as PropType<Array<TableHeader>>, required: true },
  items: { type: Array as PropType<Array<{ [key: string]: any }>>, required: true },
  currentPage: { type: Number, default: 0 },
  totalItems: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  errors: { type: Object as PropType<ErrorResponse | null>, default: () => null },
  rowClickable: { type: Boolean, default: true },
  idKey: { type: String, default: '' },
  noDataText: { type: String, default: '' },
  noDataImage: { type: String, default: '' },
});

const emit = defineEmits(['select', 'update:currentPage', 'search', 'clear']);

const searchTriggered = ref<boolean>(false);

const defaultNoDataImage = computed(() => {
  if (props.errors?.errorMessage?.length) {
    return 'server-error';
  }

  return searchTriggered.value ? 'no-results' : 'search-for-results';
});

const defaultNoDataText = computed(() => (searchTriggered.value ? 'DATA_TABLE.NO_SEARCH_RESULTS' : 'DATA_TABLE.SEARCH_FOR_RESULTS'));
const externalErrors = computed(() => props.errors);
const serverErrors = useServerErrorsMapper(externalErrors);

const vPage = computed({
  get: (): number => props.currentPage,
  set: (value: number) => {
    if (props.currentPage === value) {
      return;
    }

    emit('update:currentPage', value);
  },
});

const onRowClick = (item: any) => {
  console.log('item', item);
  if (!props.rowClickable || props.loading) {
    return;
  }

  emit('select', props.idKey ? item[props.idKey] : item);
};

const onSearch = async (): Promise<void> => {
  searchTriggered.value = true;
  emit('search');
};

const onClear = async (): Promise<void> => {
  searchTriggered.value = false;
  emit('clear');
};
</script>

<style lang="scss">
.vz-data-table {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__table-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    overflow: auto;
    margin: 8px 0;
    padding: 0 !important;

    table {
      width: 100%;
      overflow: auto;
      border-collapse: collapse;

      thead {
        margin-bottom: 2px;
        position: sticky;
        top: 0;
        z-index: 1;
        margin-top: 2px;
        border-bottom: 1px solid var(--color-mono-400);

        tr {
          position: relative;
          width: 100%;
          height: 50px;

          .vz-data-table--loading & {
            &::after {
              content: '';
              position: absolute;
              bottom: -0.125rem;
              left: 0;
              width: 100%;
              height: 0.25rem;
              background-image: linear-gradient(100deg, transparent 5%, var(--color-primary-900) 42.5%, transparent 95%);
              background-repeat: no-repeat;
              background-size: 35% 100%;
              background-position: 0 0;
              animation: skeletonOverlay 2s linear infinite;
            }

            @keyframes skeletonOverlay {
              0% {
                background-position: -100% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
          }

          td {
            color: var(--color-primary-900);
            background-color: var(--color-background-2);
            font-weight: var(--font-weight-medium);
            font-size: var(--font-size-16);

            div {
              display: flex;
              justify-content: space-between;

              span {
                flex-grow: 1;
              }
            }
          }
        }
      }

      tbody {
        tr {
          &:not(:last-child) {
            border-bottom: 1px solid var(--color-mono-400);
          }
        }
      }

      td {
        line-height: 1.5;
        padding: 16px 24px;
      }
    }
  }

  &--row-clickable {
    tbody {
      tr {
        transition: background-color 0.3s;
        cursor: pointer;

        &:hover {
          background-color: var(--color-primary-100);
        }
      }
    }
  }

  &--no-data {
    position: absolute;
    top: 0;
    left: 0;
    margin: 8px 0;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-medium);
    height: 90%;
    width: 100%;
    overflow: hidden;

    > img {
      max-height: 380px;
      max-width: 380px;
    }
  }
}
</style>
