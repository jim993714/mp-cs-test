<script setup lang="ts">
import { getDepartmentList } from '@/api/address/index';
import type { DepartmentList } from '@/api/address/types';

const props = withDefaults(
    defineProps<{
        modelValue: string[];
    }>(),
    {}
);

const emits = defineEmits<{
    (event: 'update:modelValue', val: string[]): void;
}>();

let list: DepartmentList = [];

const range = ref<DepartmentList[]>([]);
const vModel = ref<number[]>([]);

onMounted(async () => {
    const data = await getDepartmentList();
    list = data;

    let ids: number[] = [];
    if (props.modelValue.length === 3) {
        if (
            list.some((item, i) => {
                if (item.name === props.modelValue[0]) {
                    ids[0] = i;
                    item.children.some((item, i) => {
                        if (item.name === props.modelValue[1]) {
                            ids[1] = i;

                            item.children.some((item, i) => {
                                if (item.name === props.modelValue[2]) {
                                    ids[2] = i;
                                    return true;
                                }
                            });
                            return true;
                        }
                    });
                    return true;
                }
            })
        ) {
            vModel.value = ids;
        }
    }

    if (ids.length < 3) {
        ids = ids.concat(Array.from({ length: 3 - ids.length }, () => 0));
    }

    updateRange(ids[0], ids[1]);
});

function updateRange(left: number, middle = 0) {
    range.value = [list, list[left].children, list[left].children[middle].children];
}

function onColumnChange(e: { detail: { column: number; value: number } }) {
    const { column, value } = e.detail;
    if (column < range.value.length - 1) {
        vModel.value[column] = value;
        updateRange(vModel.value[0], vModel.value[1]);
    }
}

function onChange(e: { detail: { value: number[] } }) {
    vModel.value = e.detail.value;
}

watch(vModel, () => {
    if (vModel.value.length) {
        emits('update:modelValue', [
            list[vModel.value[0]].name,
            list[vModel.value[0]].children[vModel.value[1]].name,
            list[vModel.value[0]].children[vModel.value[1]].children[vModel.value[2]].name
        ]);
    }
});
</script>

<template>
    <picker
        :value="vModel"
        mode="multiSelector"
        :range="range"
        range-key="name"
        @columnchange="onColumnChange"
        @change="onChange"
    >
        <slot />
    </picker>
</template>
