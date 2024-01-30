<script setup lang="ts">
import { getProvinceCityAreaTree } from '@/api/student-auth/index';
import type { AddressItem } from '@/api/student-auth/type';

const props = withDefaults(
    defineProps<{
        modelValue: (string | number)[];
    }>(),
    {}
);

const emits = defineEmits<{
    (event: 'update:modelValue', val: string[]): void;
}>();

let list: AddressItem[] = [];

const range = ref<AddressItem[]>([]);
const vModel = ref<number[]>([]);

onMounted(async () => {
    const data = await getProvinceCityAreaTree();
    list = data;

    let ids: number[] = [];
    if (props.modelValue.length === 3) {
        if (
            list.some((item, i) => {
                if (item.label === props.modelValue[0]) {
                    ids[0] = i;
                    item.children?.some((item, i) => {
                        if (item.label === props.modelValue[1]) {
                            ids[1] = i;

                            item.children?.some((item, i) => {
                                if (item.label === props.modelValue[2]) {
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
    range.value = [
        list.map(i => ({ ...i, name: i.label })),
        list[left].children.map(i => ({ ...i, name: i.label })),
        list[left].children[middle].children.map(i => ({ ...i, name: i.label }))
    ];
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
            list[vModel.value[0]].label ?? '',
            list[vModel.value[0]]?.children?.[vModel.value[1]].label ?? '',
            list[vModel.value[0]]?.children?.[vModel.value[1]].children?.[vModel.value[2]].label ??
                '',
            list[vModel.value[0]]?.children?.[vModel.value[1]].children?.[vModel.value[2]].value +
                ''
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
