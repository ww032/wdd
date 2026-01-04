module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat', // 新功�?feature)
                'fix', // 修补bug
                'docs', // 文档(documentation)
                'style', // 格式、样�?不影响代码运行的变动)
                'refactor', // 重构(即不是新增功能，也不是修改BUG的代�?
                'perf', // 优化相关，比如提升性能、体�?                'test', // 添加测试
                'ci', // 持续集成修改
                'chore', // 构建过程或辅助工具的变动
                'revert', // 回滚到上一个版�?                'workflow', // 工作流改�?                'mod', // 不确定分类的修改
                'wip', // 开发中
                'types', // 类型修改
                'release' // 版本发布
            ]
        ],
        'subject-full-stop': [0, 'never'],
        'subject-case': [0, 'never']
    }
}
