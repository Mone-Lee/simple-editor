<template>
    <div class="simeditor-toolbar">
        <ul class="toolbar-list">
            <li v-for="tool in tools" :key="tool.title" :class="{'table-active': tool.isClick}" :id="'toolbar-' + tool.type" @click.prevent="setTextStyle(tool)">
                <span :class="['toolbar-item iconfont', `toolbar-item-${tool.type}`, {'disabled': !tool.isWork || tool.isDisabled}, {'active': tool.isActive}]" :title="tool.title" :icon="tool.icon"></span>

                <div v-if="tool.type === 'table' && tool.isClick" class="toolbar-menu-table" id="toolbar-table">
                    <div class="rows" v-for="row in 5" :key="'row' + row">
                        <div class="cols" v-for="col in 6" :key="'col' + col">
                            <div class="td" :class="{'selected': row <= tablePoint.row && col <= tablePoint.col }" @mouseover.stop="selectTablePoint(row, col)" @click.stop="setTablePoint"></div>
                        </div>
                    </div>
                </div>
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
                },
                {
                    title: '插入图片',
                    type: 'upload',
                    isDisabled: false,
                    isActive: false,
                    isWork: true
                },
                {
                    title: '插入链接',
                    type: 'link',
                    isDisabled: false,
                    isActive: false,
                    isWork: true
                },
                {
                    title: '有序列表',
                    type: 'ol',
                    isDisabled: false,
                    isActive: false,
                    isWork: true
                },
                {
                    title: '无序列表',
                    type: 'ul',
                    isDisabled: false,
                    isActive: false,
                    isWork: true
                },
                {
                    title: '分割线',
                    type: 'hr',
                    isDisabled: false,
                    isActive: false,
                    isWork: true
                },
                {
                    title: '表格',
                    type: 'table',
                    isDisabled: false,
                    isActive: false,
                    isWork: true,
                    isClick: false,     // 被点击时，显示表格创建选择弹窗
                }
            ],
            tablePoint: {
                row: 0,
                col: 0
            }
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

            if (item.type === 'upload' || item.type === 'hr') {
                this.tools.map(item => {
                    item.isActive = false;
                });
            }

            if (item.type === 'ol' || item.type === 'ul') {
                this.tools[0].isActive = false;
            }

            if (item.type === 'table') {
                item.isActive = true;
                item.isClick = true;
            }

            if (item.type !== 'table') {
                this.$emit('setTextStyle', item);
            }
        },

        selectTablePoint(row, col) {
            this.tablePoint.row = row;
            this.tablePoint.col = col;
        },

        setTablePoint() {
            let command = {
                type: 'table',
                tablePoint: this.tablePoint
            };
            this.$emit('setTextStyle', command);
            this.tools[8].isClick = false;
            // 清空旧数据
            this.tablePoint = {
                row: 0,
                col: 0
            };
        },

        hideTableMenu() {
            this.tools[8].isActive = false;
            this.tools[8].isClick = false;
            this.tablePoint = {
                row: 0,
                col: 0
            };
        }
    },
    watch: {
        activeList(arr) {
            this.tools[0].isActive = arr.includes('h3');
            this.tools[1].isActive = arr.includes('b') || arr.includes('strong');   // IE浏览器使用<strong>
            this.tools[2].isActive = arr.includes('i') || arr.includes('em');   // IE浏览器使用<em>
            this.tools[4].isActive = arr.includes('a');
            this.tools[5].isActive = arr.includes('ol');
            this.tools[8].isActive = arr.includes('table');
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
    padding-left: 5px;

    &>li {
        font-size: 12px;
        height: 30px;
        color: #595959;
        list-style: none;
        position: relative;
    }

    .table-active {
        background: #FFFFFF;
        box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.2);
    }
}
.toolbar-item {
    font-size: 12px;
    color: #595959;
    width: 30px;
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

    &.toolbar-item-link {
        font-size: 15px;
    }

    &.toolbar-item-ol {
        font-size: 16px;
    }

    &.toolbar-item-ul {
        font-size: 17px;
    }

    &.toolbar-item-table {
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

.toolbar-menu-table {
    position: absolute;
    top: 30px;
    left: 0;
    z-index: 20;
    background: #fff;
    text-align: left;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
    padding: 1px;

    .rows {
        display: flex;
        align-items: center;
    }

    .td {
        height: 14px;
        width: 16px;
        padding: 0;
        border: 1px solid #fff;
        background: #f3f3f3;
        cursor: pointer;

        &.selected {
            background: #cfcfcf;
        }
    }
}
</style>