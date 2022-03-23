## 简介
    一个使用umi+dva的CRUD的小项目，练习使用umi约定式路由（页面路径）、dva数据仓库（主要就是R：查询的功能，查询到的数据统一放在model中，在页面使用connect来获取数据，CUD业务结束后的R异步subscription加载最新数据）R走model，CUD走service直接调接口，await之后调reloadHandler()，CU复用组件Modal(UserModal.tsx),

    约定式路由：不配置routes，Umi会进入约定式路由模式，然后分析 src/pages 目录拿到路由配置
    ```bash
        文件结构：
        .
        └── pages
            └── users
                ├── _layout.tsx
                ├── index.tsx
                └── list.tsx
        输出的路由：
            [
                { exact: false, path: '/users', component: '@/pages/users/_layout',
                    routes: [
                    { exact: true, path: '/users', component: '@/pages/users/index' },
                    { exact: true, path: '/users/list', component: '@/pages/users/list' },
                    ]
                }
            ]
        localhost:8000/users/index 访问主页
    ```

## 接口文档
https://public-api-v1.aspirantzhang.com/

## Note
1、解决跨域问题
```bash
在.umirc.ts内添加代理可解决跨域问题
 proxy: {
    '/api': {
      'target': 'https://public-api-v1.aspirantzhang.com/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
```

2、分页<Pagination>
onChange翻页
onShowSizeChange每页数量
```bash
      <Pagination
        className='list-page'
        total={users.meta.total}
        current={users.meta.page}
        pageSize={users.meta.per_page}
        showSizeChanger
        showQuickJumper
        showTotal={total => `Total ${total} items`}
        onChange={paginationHandler}
        onShowSizeChange={pageSizeHandler}
      />
```