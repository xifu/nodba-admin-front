import store from '@/store'

export function menusConventToTree(menus) {
  if (menus && menus instanceof Array && menus.length > 0) {
    let temp = JSON.parse(JSON.stringify(menus));
    let roots = [];
    for(let i=0;i<temp.length;i++) {
      let menu1 = temp[i];
      if (menu1.parentId == 0) {
        roots.push(menu1);
      }
      let children = menu1.children;
      for (let j = 0; j < temp.length; j++) {
        let menu2 = temp[j];
        if (menu2.parentId == menu1.id){
          if (!children) {
            children = [];
            menu1.children = children;
          }
          children.push(menu2);
        }
      }
    }
    return roots;
  }else {
    console.error("menus is empty!");
    return [];
  }
}


/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
