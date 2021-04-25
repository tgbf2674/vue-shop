import Vue from 'vue'
import { Button, Cascader, Tag, Select, Option, Tree, MessageBox, Dialog, Table, Pagination, Tooltip, Switch, TableColumn, Col, Row, Card, Form, FormItem, Input, Message, Container, Aside, Header, Main, Menu, MenuItem, Submenu, Breadcrumb, BreadcrumbItem } from 'element-ui'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
