const getMenuFrontEnd = (role = 'USER_ROLE') => {
    const menu = [{
            titulo: 'Dashboard',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Main', url: '/' },
                { titulo: 'Gráficas', url: 'grafica1' },
                { titulo: 'Rxjs', url: 'rxjs' },
                { titulo: 'Promesas', url: 'promesas' },
                { titulo: 'ProgressBar', url: 'progress' }

            ]
        },
        {
            titulo: 'Mantenimiento',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // { titulo: 'Usuarios', url: 'usuarios'},
                { titulo: 'Hospitales', url: 'hospitales' },
                { titulo: 'Médicos', url: 'medicos' },
            ]
        },
    ];

    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: 'usuarios' });
        // unshift lo agrera a la primera posicion del arreglo
    }

    return menu;

}


module.exports = {
    getMenuFrontEnd
}