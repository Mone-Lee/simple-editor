<template>
    <div class="simeditor-toolbar">
        <ul class="toolbar-list">
            <li v-for="tool in tools" :key="tool.title" @click.prevent="setTextStyle(tool)">
                <span :class="['toolbar-item iconfont', `toolbar-item-${tool.type}`, {'disabled': !tool.isWork || tool.isDisabled}, {'active': tool.isActive}]" :title="tool.title" :icon="tool.icon"></span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        activeList: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            tools: [
                {
                    title: '标题',
                    type: 'title',
                    isDisabled: false,
                    isActive: false,
                    isWork: true
                },
                {
                    title: '加粗文字',
                    type: 'bold',
                    isDisabled: false,
                    isActive: false,
                    isWork: true
                },
                {
                    title: '斜体文字',
                    type: 'italic',
                    isDisabled: false,
                    isActive: false,
                    isWork: true
                }
            ]
        };
    },
    mounted() {
        this.tools.map((item, i) => {
            if (i > 0 && !document.queryCommandState) {
                item.isWork = false;
            }
        });
    },
    methods: {
        setTextStyle(item) {
            if (item.isDisabled || !item.isWork)  return;

            this.$emit('setTextStyle', item.type);
        },
    },
    watch: {
        activeList(arr) {
            this.tools[0].isActive = arr.includes('h3');
            this.tools[1].isActive = arr.includes('b') || arr.includes('strong');   // IE浏览器使用<strong>
            this.tools[2].isActive = arr.includes('i') || arr.includes('em');   // IE浏览器使用<em>
        }
    }
};
</script>

<style lang="less" scoped>
.simeditor-toolbar {
    width: 100%;
    height: 30px;
    text-align: left;
    background-color: #f0f0f0;
    user-select: none;
}
.toolbar-list {
    display: flex;
    align-items: center;

    &>li {
        width: 30px;
        font-size: 12px;
        height: 30px;
        color: #595959;
    }
}
.toolbar-item {
    font-size: 12px;
    color: #595959;
    width: 40px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-sizing: border-box;

    &.toolbar-item-bold {
        font-weight: 600;
        opacity: 0.75;
    }

    &.toolbar-item-italic {
        font-size: 14px;
    }

    &.disabled {
        opacity: 0.5 !important;
        cursor: default !important;
    }

    &.active {
        color: #3da8f5;
    }
}
</style>