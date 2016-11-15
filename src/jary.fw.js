(function(){
    var moduleMap = {};//自定义map，存储模块
    var fileMap = {};//自定义map，存储文件
    var noop = function(){};//自定义function

    //创建一个全局变量"window.jary"
    window.jary = jary = {
        //定义模块
        define: function(name, dependencies, factory){
            if(!moduleMap[name]){
                var module = {
                    name: name, //模块名
                    dependencies: dependencies, //依赖
                    factory: factory //工厂方法
                };
                moduleMap[name] = module;
            };
            return moduleMap[name];
        },
        //使用模块
        use: function(name){
            var module = moduleMap[name];
            if(!module.entity){
                var args = [];//数组参数arguments
                for (var i = 0; i < module.dependencies.length; i++) {
                    if(moduleMap[module.dependencies[i]].entity){
                        args.push(moduleMap[module.dependencies[i]].entity);
                    }else{
                        args.push(this.use(module.dependencies[i]));
                    }
                }
                module.entity = module.factory.apply(noop, args);
            }
            return module.entity;
        },
        //加载模块
        require: function(pathArr, callback){
            for (var i = 0; i < pathArr.length; i++) {
                var path = pathArr[i];
                if(!fileMap[path]){
                    var head = document.getElementByTagName('head')[0];
                    var node = document.creatElement('script');
                    node.type = 'text/javascript';
                    node.async = 'true';
                    node.src = path + '.js';
                    node.onload = function(){
                        fileMap[path] = true;
                        head.removeChild(node);
                        checkAllFiles();
                    };
                    head.appendChild(node);
                }
            };
            function checkAllFiles(){
                var allLoaded = true;
                for (var i = 0; i < pathArr.length; i++) {
                    if(!fileMap[pathArr[i]]){
                        allLoaded = false;
                        break;
                    }
                };
                if(allLoaded){
                    callback();
                };
            };
        }
    };

    //定义版本
    jary.version = '1.0';
})();