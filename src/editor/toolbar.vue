<template>
    <div class="simeditor-toolbar">
        <ul class="toolbar-list">
            <li v-for="tool in tools" :key="tool.title">
                <span :class="`toolbar-item iconfont toolbar-item-${tool.type}`" :title="tool.title" :icon="tool.icon"></span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tools: [
                {
                    title: '标题',
                    type: 'title',
                },
                {
                    title: '加粗文字',
                    type: 'bold',
                },
                {
                    title: '斜体文字',
                    type: 'italic',
                }
            ]
        };
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
}
</style>