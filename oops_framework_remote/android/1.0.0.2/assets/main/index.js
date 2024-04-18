System.register("chunks:///_virtual/Account.ts", ['cc', './Oops.ts', './ECS.ts', './GameEvent.ts', './AccountNetData.ts', './AccountModelComp.ts'], function (exports) {
  var cclegacy, oops, ecs, GameEvent, AccountNetDataComp, AccountModelComp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      AccountNetDataComp = module.AccountNetDataComp;
    }, function (module) {
      AccountModelComp = module.AccountModelComp;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "33c06qSPa9MRbTUOf1u+7SR", "Account", undefined);

      /**
       * 账号模块
       * 1、连接游戏服务器
       * 2、登录玩家帐号，获取玩家信息
       * 3、断线重连接
       */
      let Account = exports('Account', (_dec = ecs.register('Account'), _dec(_class = class Account extends ecs.Entity {
        constructor(...args) {
          super(...args);
          this.AccountModel = void 0;
          this.AccountNetData = void 0;
        }
        init() {
          this.addComponents(AccountModelComp);
          this.addEvent();
        }
        destroy() {
          this.removeEvent();
          super.destroy();
        }

        /** 添加全局消息事件 */
        addEvent() {
          oops.message.on(GameEvent.GameServerConnected, this.onHandler, this);
        }

        /** 移除全局消息事件 */
        removeEvent() {
          oops.message.off(GameEvent.GameServerConnected, this.onHandler, this);
        }
        onHandler(event, args) {
          switch (event) {
            case GameEvent.GameServerConnected:
              this.getPlayer();
              break;
          }
        }

        /** 连接游戏服务器 */
        connect() {
          // netChannel.gameCreate();
          // netChannel.gameConnect();

          // 无网状态下测试代码，有网络时会通过触发网络连接成功事件对接后续流程
          oops.message.dispatchEvent(GameEvent.GameServerConnected);
        }

        /** 获取玩家信息 */
        getPlayer() {
          this.add(AccountNetDataComp);
        }
      }) || _class));

      // export class EcsAccountSystem extends ecs.System {
      //     constructor() {
      //         super();

      //         this.add(new AccountNetDataSystem());
      //     }
      // }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AccountModelComp.ts", ['cc', './ECS.ts'], function (exports) {
  var cclegacy, ecs;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ecs = module.ecs;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "48e3172BRZA+ZLehWBTVmsA", "AccountModelComp", undefined);
      /** 
       * 游戏帐号数据 
       */
      let AccountModelComp = exports('AccountModelComp', (_dec = ecs.register('AccountModel'), _dec(_class = class AccountModelComp extends ecs.Comp {
        constructor(...args) {
          super(...args);
          /** 资源列表 */
          this.currency = {};
          /** 角色对象 */
          this.role = null;
        }
        reset() {}
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AccountNetData.ts", ['cc', './Oops.ts', './ECS.ts', './GameEvent.ts', './NetConfig.ts', './Role.ts', './AccountModelComp.ts'], function (exports) {
  var cclegacy, v3, oops, ecs, GameEvent, Role, AccountModelComp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      v3 = module.v3;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, null, function (module) {
      Role = module.Role;
    }, function (module) {
      AccountModelComp = module.AccountModelComp;
    }],
    execute: function () {
      var _dec, _class, _dec2, _class2;
      cclegacy._RF.push({}, "699d51NeD5NRb69k81G+Znx", "AccountNetData", undefined);

      /** 请求玩家游戏数据 */
      let AccountNetDataComp = exports('AccountNetDataComp', (_dec = ecs.register('AccountNetData'), _dec(_class = class AccountNetDataComp extends ecs.Comp {
        reset() {}
      }) || _class));

      /** 请求玩家游戏数据 */
      let AccountNetDataSystem = exports('AccountNetDataSystem', (_dec2 = ecs.register('Account'), _dec2(_class2 = class AccountNetDataSystem extends ecs.ComblockSystem {
        filter() {
          return ecs.allOf(AccountNetDataComp, AccountModelComp);
        }
        entityEnter(e) {
          let onComplete = {
            target: this,
            callback: data => {
              // 设置本地存储的用户标识（用于下次登录不输入帐号）
              this.setLocalStorage(data.id);

              // 创建玩家角色对象
              this.createRole(e, data);

              // 玩家登录成功事件
              oops.message.dispatchEvent(GameEvent.LoginSuccess);
            }
          };
          // 请求登录游戏获取角色数据
          // netChannel.game.req("LoginAction", "loadPlayer", params, onComplete);

          // 离线测试代码开始
          var data = {
            id: 1,
            name: "Oops",
            power: 10,
            agile: 10,
            physical: 10,
            lv: 1,
            jobId: 1
          };
          onComplete.callback(data);
          // 离线测试代码结束

          e.remove(AccountNetDataComp);
        }

        /** 创建角色对象（自定义逻辑） */
        createRole(e, data) {
          var role = ecs.getEntity(Role);

          // 角色数据
          role.RoleModel.id = data.id;
          role.RoleModel.name = data.name;

          // 角色初始战斗属性
          role.RoleModelBase.power = data.power;
          role.RoleModelBase.agile = data.agile;
          role.RoleModelBase.physical = data.physical;

          // 角色等级数据
          role.upgrade(data.lv);

          // 角色职业数据
          role.RoleModelJob.id = data.jobId;

          // 角色基础属性绑定到界面上显示
          role.RoleModel.vmAdd();
          // 角色等级属性绑定到界面上显示
          role.RoleModelLevel.vmAdd();
          // 角色初始基础属性绑定到界面上显示
          role.RoleModelBase.vmAdd();

          // 角色动画显示对象
          role.load(oops.gui.game, v3(0, -300, 0));
          e.AccountModel.role = role;
        }

        /** 设置本地存储的用户标识 */
        setLocalStorage(uid) {
          oops.storage.setUser(uid);
          oops.storage.set("account", uid);
        }
      }) || _class2));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Ambilight.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, CCInteger, _decorator, Component, Sprite;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      CCInteger = module.CCInteger;
      _decorator = module._decorator;
      Component = module.Component;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "73c69GH9M9F2Ilsm0fvjTCX", "Ambilight", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let Ambilight = exports('Ambilight', (_dec = ccclass('Ambilight'), _dec2 = property(CCInteger), _dec(_class = (_class2 = class Ambilight extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "_max", _descriptor, this);
          this._start = 0;
          this._material = void 0;
        }
        get max() {
          return this._max;
        }
        set max(value) {
          this._max = value;
        }
        update(dt) {
          this._material = this.node.getComponent(Sprite).getMaterial(0);
          if (this.node.active && this._material) {
            this._setShaderTime(dt);
          }
        }
        _setShaderTime(dt) {
          let start = this._start;
          if (start > this.max) start = 0;
          start += 0.015;
          this._material.setProperty('speed', start);
          this._start = start;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_max", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "max", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "max"), _class2.prototype)), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimationEventHandler.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f0c5aeHTF5B9a7hg62tkEpe", "AnimationEventHandler", undefined);
      /*
       * @Author: dgflash
       * @Date: 2021-09-22 16:42:25
       * @LastEditors: dgflash
       * @LastEditTime: 2022-06-14 19:55:59
       */
      class FrameEventData {
        constructor() {
          this.callback = void 0;
          this.target = void 0;
        }
      }

      /** 模型动作自定义事件逻辑 */
      class AnimationEventHandler {
        constructor() {
          this.frameEvents = new Map();
          this.finishedEvents = new Map();
        }
        addFrameEvent(type, callback, target) {
          var data = new FrameEventData();
          data.callback = callback;
          data.target = target;
          this.frameEvents.set(type, data);
        }
        addFinishedEvent(type, callback, target) {
          var data = new FrameEventData();
          data.callback = callback;
          data.target = target;
          this.finishedEvents.set(type, data);
        }
        onFrameEventCallback(type, target) {
          var data = this.frameEvents.get(type);
          if (data) data.callback.call(data.target, type, target);
        }
        onFinishedCallback(target) {
          var data = this.finishedEvents.get(target.curStateName);
          if (data) data.callback.call(data.target, target.curStateName, target);
        }
        playAnimation(animName, loop) {}
        scaleTime(scale) {}
      }
      exports('AnimationEventHandler', AnimationEventHandler);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorAnimation.ts", ['cc', './AnimatorBase.ts'], function (exports) {
  var cclegacy, Animation, _decorator, AnimatorBase;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Animation = module.Animation;
      _decorator = module._decorator;
    }, function (module) {
      AnimatorBase = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _class;
      cclegacy._RF.push({}, "64571Qy/TlCEZI/28RxIG+E", "AnimatorAnimation", undefined);
      const {
        ccclass,
        property,
        requireComponent,
        disallowMultiple,
        menu
      } = _decorator;

      /** 
       * Cocos Animation状态机组件
       */
      let AnimatorAnimation = exports('default', (_dec = requireComponent(Animation), _dec2 = menu('animator/AnimatorAnimation'), ccclass(_class = disallowMultiple(_class = _dec(_class = _dec2(_class = class AnimatorAnimation extends AnimatorBase {
        constructor(...args) {
          super(...args);
          /** Animation组件 */
          this._animation = null;
          /** 当前的动画实例 */
          this._animState = null;
          /** 记录初始的wrapmode */
          this._wrapModeMap = new Map();
        }
        start() {
          if (!this.PlayOnStart || this._hasInit) {
            return;
          }
          this._hasInit = true;
          this._animation = this.getComponent(Animation);
          this._animation.on(Animation.EventType.FINISHED, this.onAnimFinished, this);
          this._animation.on(Animation.EventType.LASTFRAME, this.onAnimFinished, this);
          if (this.AssetRawUrl !== null) {
            this.initJson(this.AssetRawUrl.json);
          }
        }

        /**
         * 手动初始化状态机，可传入0-3个参数，类型如下
         * - onStateChangeCall 状态切换时的回调
         * - stateLogicMap 各个状态逻辑控制
         * - animationPlayer 自定义动画控制
         * @override
         */
        onInit(...args) {
          if (this.PlayOnStart || this._hasInit) {
            return;
          }
          this._hasInit = true;
          this.initArgs(...args);
          this._animation = this.getComponent(Animation);
          this._animation.on(Animation.EventType.FINISHED, this.onAnimFinished, this);
          this._animation.on(Animation.EventType.LASTFRAME, this.onAnimFinished, this);
          if (this.AssetRawUrl !== null) {
            this.initJson(this.AssetRawUrl.json);
          }
        }

        /**
         * 播放动画
         * @override
         * @param animName 动画名
         * @param loop 是否循环播放
         */
        playAnimation(animName, loop) {
          if (!animName) {
            return;
          }
          this._animation.play(animName);
          this._animState = this._animation.getState(animName);
          if (!this._animState) {
            return;
          }
          if (!this._wrapModeMap.has(this._animState)) {
            this._wrapModeMap.set(this._animState, this._animState.wrapMode);
          }
          this._animState.wrapMode = loop ? 2 : this._wrapModeMap.get(this._animState);
        }

        /**
         * 缩放动画播放速率
         * @override
         * @param scale 缩放倍率
         */
        scaleTime(scale) {
          if (this._animState) {
            this._animState.speed = scale;
          }
        }
      }) || _class) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorBase.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AnimatorController.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, JsonAsset, _decorator, Component, AnimatorController;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      JsonAsset = module.JsonAsset;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      AnimatorController = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "7ff14NOug1NAIB1XgQlC9Gc", "AnimatorBase", undefined);
      const {
        ccclass,
        property,
        executionOrder,
        menu
      } = _decorator;

      /**
       * 自定义控制动画播放的接口
       */
      /**
       * 状态机组件基类 优先执行生命周期
       */
      let AnimatorBase = exports('default', (_dec = executionOrder(-1000), _dec2 = menu('animator/AnimatorBase'), _dec3 = property({
        type: JsonAsset,
        tooltip: '状态机json文件'
      }), _dec4 = property({
        tooltip: '是否在start中自动启动状态机'
      }), _dec5 = property({
        tooltip: '是否在update中自动触发状态机逻辑更新'
      }), ccclass(_class = _dec(_class = _dec2(_class = (_class2 = class AnimatorBase extends Component {
        constructor(...args) {
          super(...args);
          /** ---------- 后续扩展代码 结束 ---------- */
          _initializerDefineProperty(this, "AssetRawUrl", _descriptor, this);
          _initializerDefineProperty(this, "PlayOnStart", _descriptor2, this);
          _initializerDefineProperty(this, "AutoUpdate", _descriptor3, this);
          /** 是否初始化 */
          this._hasInit = false;
          /** 状态机控制 */
          this._ac = null;
          /** 各个状态逻辑控制，key为状态名 */
          this._stateLogicMap = null;
          /** 状态切换时的回调 */
          this._onStateChangeCall = null;
          /** 自定义的动画播放控制器 */
          this._animationPlayer = null;
        }
        /** ---------- 后续扩展代码 开始 ---------- */

        /** 三维骨骼动画动画帧自定义事件 */
        onFrameEvent(param) {
          var _this$_animationPlaye;
          (_this$_animationPlaye = this._animationPlayer) == null || _this$_animationPlaye.onFrameEventCallback(param, this);
        }
        /** 当前状态名 */
        get curStateName() {
          return this._ac.curState.name;
        }
        /** 当前动画名 */
        get curStateMotion() {
          return this._ac.curState.motion;
        }

        /** 获取指定状态 */
        getState(name) {
          return this._ac.states.get(name);
        }

        /**
         * 手动初始化状态机，可传入0-3个参数，类型如下
         * - onStateChangeCall 状态切换时的回调
         * - stateLogicMap 各个状态逻辑控制
         * - animationPlayer 自定义动画控制
         * @virtual
         */
        onInit(...args) {}

        /**
         * 处理初始化参数
         */
        initArgs(...args) {
          args.forEach(arg => {
            if (!arg) {
              return;
            }
            if (typeof arg === 'function') {
              this._onStateChangeCall = arg;
            } else if (typeof arg === 'object') {
              if (arg instanceof Map) {
                this._stateLogicMap = arg;
              } else {
                this._animationPlayer = arg;
              }
            }
          });
        }
        updateAnimator() {
          // 混合当前动画播放速度
          let playSpeed = this._ac.curState.speed;
          if (this._ac.curState.multi) {
            playSpeed *= this._ac.params.getNumber(this._ac.curState.multi) ?? 1;
          }
          this.scaleTime(playSpeed);

          // 更新动画状态逻辑
          if (this._stateLogicMap) {
            let curLogic = this._stateLogicMap.get(this._ac.curState.name);
            curLogic && curLogic.onUpdate();
          }

          // 更新状态机逻辑
          this._ac.updateAnimator();
        }
        update() {
          if (this._hasInit && this.AutoUpdate) {
            this.updateAnimator();
          }
        }

        /**
         * 手动调用更新
         */
        manualUpdate() {
          if (this._hasInit && !this.AutoUpdate) {
            this.updateAnimator();
          }
        }

        /**
         * 解析状态机json文件
         */
        initJson(json) {
          this._ac = new AnimatorController(this, json);
        }

        /**
         * 动画结束的回调
         */
        onAnimFinished() {
          var _this$_animationPlaye2;
          this._ac.onAnimationComplete();
          (_this$_animationPlaye2 = this._animationPlayer) == null || _this$_animationPlaye2.onFinishedCallback(this);
        }

        /**
         * 播放动画
         * @virtual
         * @param animName 动画名
         * @param loop 是否循环播放
         */
        playAnimation(animName, loop) {}

        /**
         * 缩放动画播放速率
         * @virtual
         * @param scale 缩放倍率
         */
        scaleTime(scale) {}

        /** 
         * 状态切换时的逻辑（状态机内部方法，不能由外部直接调用）
         */
        onStateChange(fromState, toState) {
          this.playAnimation(toState.motion, toState.loop);
          let fromStateName = fromState ? fromState.name : '';
          if (this._stateLogicMap) {
            let fromLogic = this._stateLogicMap.get(fromStateName);
            fromLogic && fromLogic.onExit();
            let toLogic = this._stateLogicMap.get(toState.name);
            toLogic && toLogic.onEntry();
          }
          this._onStateChangeCall && this._onStateChangeCall(fromStateName, toState.name);
        }

        /**
         * 设置boolean类型参数的值
         */
        setBool(key, value) {
          this._ac.params.setBool(key, value);
        }

        /**
         * 获取boolean类型参数的值
         */
        getBool(key) {
          return this._ac.params.getBool(key) !== 0;
        }

        /**
         * 设置number类型参数的值
         */
        setNumber(key, value) {
          this._ac.params.setNumber(key, value);
        }

        /**
         * 获取number类型参数的值
         */
        getNumber(key) {
          return this._ac.params.getNumber(key);
        }

        /**
         * 设置trigger类型参数的值
         */
        setTrigger(key) {
          this._ac.params.setTrigger(key);
        }

        /**
         * 重置trigger类型参数的值
         */
        resetTrigger(key) {
          this._ac.params.resetTrigger(key);
        }

        /**
         * 设置autoTrigger类型参数的值（autoTrigger类型参数不需要主动reset，每次状态机更新结束后会自动reset）
         */
        autoTrigger(key) {
          this._ac.params.autoTrigger(key);
        }

        /**
         * 无视条件直接跳转状态
         * @param 状态名
         */
        play(stateName) {
          if (!this._hasInit) {
            return;
          }
          this._ac.play(stateName);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "AssetRawUrl", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "PlayOnStart", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "AutoUpdate", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      })), _class2)) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorCondition.ts", ['cc'], function (exports) {
  var error, cclegacy;
  return {
    setters: [function (module) {
      error = module.error;
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8ade2h2C/ZA86thhI0NNuqu", "AnimatorCondition", undefined);
      /** 参数类型 */
      let ParamType = exports('ParamType', /*#__PURE__*/function (ParamType) {
        ParamType[ParamType["COMPLETE"] = 0] = "COMPLETE";
        ParamType[ParamType["BOOLEAN"] = 1] = "BOOLEAN";
        ParamType[ParamType["NUMBER"] = 2] = "NUMBER";
        ParamType[ParamType["TRIGGER"] = 3] = "TRIGGER";
        ParamType[ParamType["AUTO_TRIGGER"] = 4] = "AUTO_TRIGGER";
        return ParamType;
      }({}));

      /** 逻辑类型 */
      let LogicType = exports('LogicType', /*#__PURE__*/function (LogicType) {
        LogicType[LogicType["EQUAL"] = 0] = "EQUAL";
        LogicType[LogicType["NOTEQUAL"] = 1] = "NOTEQUAL";
        LogicType[LogicType["GREATER"] = 2] = "GREATER";
        LogicType[LogicType["LESS"] = 3] = "LESS";
        LogicType[LogicType["GREATER_EQUAL"] = 4] = "GREATER_EQUAL";
        LogicType[LogicType["LESS_EQUAL"] = 5] = "LESS_EQUAL";
        return LogicType;
      }({}));

      /**
       * 单项条件
       */
      class AnimatorCondition {
        constructor(data, ac) {
          this._ac = void 0;
          /** 此条件对应的参数名 */
          this._param = "";
          /** 此条件对应的值 */
          this._value = 0;
          /** 此条件与值比较的逻辑 */
          this._logic = LogicType.EQUAL;
          this._ac = ac;
          this._param = data.param;
          this._value = data.value;
          this._logic = data.logic;
        }
        getParamName() {
          return this._param;
        }
        getParamType() {
          return this._ac.params.getParamType(this._param);
        }

        /** 判断此条件是否满足 */
        check() {
          let type = this.getParamType();
          if (type === ParamType.BOOLEAN) {
            return this._ac.params.getBool(this._param) === this._value;
          } else if (type === ParamType.NUMBER) {
            let value = this._ac.params.getNumber(this._param);
            switch (this._logic) {
              case LogicType.EQUAL:
                return value === this._value;
              case LogicType.NOTEQUAL:
                return value !== this._value;
              case LogicType.GREATER:
                return value > this._value;
              case LogicType.LESS:
                return value < this._value;
              case LogicType.GREATER_EQUAL:
                return value >= this._value;
              case LogicType.LESS_EQUAL:
                return value <= this._value;
              default:
                return false;
            }
          } else if (type === ParamType.AUTO_TRIGGER) {
            return this._ac.params.getAutoTrigger(this._param) !== 0;
          } else if (type === ParamType.TRIGGER) {
            return this._ac.params.getTrigger(this._param) !== 0;
          } else {
            error(`[AnimatorCondition.check] 错误的type: ${type}`);
            return false;
          }
        }
      }
      exports('default', AnimatorCondition);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorController.ts", ['cc', './AnimatorParams.ts', './AnimatorState.ts'], function (exports) {
  var error, cclegacy, AnimatorParams, AnimatorState;
  return {
    setters: [function (module) {
      error = module.error;
      cclegacy = module.cclegacy;
    }, function (module) {
      AnimatorParams = module.default;
    }, function (module) {
      AnimatorState = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "01df9SMBjRCyYDE7SgbZxua", "AnimatorController", undefined);

      /**
       * 状态机控制类
       */
      class AnimatorController {
        /** 当前运行的状态 */
        get curState() {
          return this._curState;
        }
        get params() {
          return this._params;
        }
        get states() {
          return this._states;
        }
        constructor(player, json) {
          this._jsonData = null;
          this._animator = null;
          this._params = null;
          this._states = null;
          this._anyState = null;
          this._curState = null;
          /** 状态切换次数 */
          this._changeCount = 0;
          /** 对应animComplete的状态 */
          this.animCompleteState = null;
          /** 动画播放完毕的标记 */
          this.animComplete = false;
          this._animator = player;
          this._jsonData = json;
          this._states = new Map();
          this._params = new AnimatorParams(json.parameters);
          this.init(json);
        }

        /**
         * 初始化状态机所有动画状态
         */
        init(json) {
          if (json.states.length <= 0) {
            error(`[AnimatorController.init] 状态机json错误`);
            return;
          }
          let defaultState = json.defaultState;
          this._anyState = new AnimatorState(json.anyState, this);
          for (let i = 0; i < json.states.length; i++) {
            let state = new AnimatorState(json.states[i], this);
            this._states.set(state.name, state);
          }
          this.changeState(defaultState);
        }
        updateState() {
          this._curState.checkAndTrans();
          if (this._curState !== this._anyState && this._anyState !== null) {
            this._anyState.checkAndTrans();
          }
        }

        /**
         * 更新状态机逻辑
         */
        updateAnimator() {
          // 重置计数
          this._changeCount = 0;
          this.updateState();

          // 重置动画完成标记
          if (this.animComplete && this.animCompleteState.loop) {
            this.animComplete = false;
          }
          // 重置autoTrigger
          this.params.resetAllAutoTrigger();
        }
        onAnimationComplete() {
          this.animComplete = true;
          this.animCompleteState = this._curState;
          // cc.log(`animation complete: ${this._curState.name}`);
        }

        /**
         * 无视条件直接跳转状态
         * @param 状态名
         */
        play(stateName) {
          if (!this._states.has(stateName) || this._curState.name === stateName) {
            return;
          }

          // 重置动画完成标记
          this.animComplete = false;
          this.changeState(stateName);
        }

        /**
         * 切换动画状态
         */
        changeState(stateName) {
          this._changeCount++;
          if (this._changeCount > 1000) {
            error('[AnimatorController.changeState] error: 状态切换递归调用超过1000次，transition设置可能出错!');
            return;
          }
          if (this._states.has(stateName) && (this._curState === null || this._curState.name !== stateName)) {
            let oldState = this._curState;
            this._curState = this._states.get(stateName);
            this._animator.onStateChange(oldState, this._curState);
            this.updateState();
          } else {
            error(`[AnimatorController.changeState] error state: ${stateName}`);
          }
        }
      }
      exports('default', AnimatorController);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorCustomization.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AnimatorBase.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, AnimatorBase;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      AnimatorBase = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "fe7aemTdvFBeJlAmC+6XphU", "AnimatorCustomization", undefined);
      const {
        ccclass,
        property,
        menu,
        disallowMultiple
      } = _decorator;

      /** 
       * 自定义动画控制的状态机组件
       */
      let AnimatorCustomization = exports('default', (_dec = menu('animator/AnimatorCustomization'), _dec2 = property({
        override: true,
        visible: false
      }), ccclass(_class = disallowMultiple(_class = _dec(_class = (_class2 = class AnimatorCustomization extends AnimatorBase {
        constructor(...args) {
          super(...args);
          /** 此组件必须主动调用onInit初始化 */
          _initializerDefineProperty(this, "PlayOnStart", _descriptor, this);
        }
        /**
         * 手动初始化状态机，可传入0-3个参数，类型如下
         * - onStateChangeCall 状态切换时的回调
         * - stateLogicMap 各个状态逻辑控制
         * - animationPlayer 自定义动画控制
         * @override
         */
        onInit(...args) {
          if (this._hasInit) {
            return;
          }
          this._hasInit = true;
          this.initArgs(...args);
          if (this.AssetRawUrl !== null) {
            this.initJson(this.AssetRawUrl.json);
          }
        }

        /**
         * 播放动画
         * @override
         * @param animName 动画名
         * @param loop 是否循环播放
         */
        playAnimation(animName, loop) {
          if (this._animationPlayer && animName) {
            this._animationPlayer.playAnimation(animName, loop);
          }
        }

        /**
         * 缩放动画播放速率
         * @override
         * @param scale 缩放倍率
         */
        scaleTime(scale) {
          if (this._animationPlayer) {
            this._animationPlayer.scaleTime(scale);
          }
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "PlayOnStart", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _class2)) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorDragonBones.ts", ['cc', './AnimatorBase.ts'], function (exports) {
  var cclegacy, dragonBones, _decorator, AnimatorBase;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      dragonBones = module.dragonBones;
      _decorator = module._decorator;
    }, function (module) {
      AnimatorBase = module.default;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "dc324J03ptB8b2JV9Ljduzh", "AnimatorDragonBones", undefined);
      const {
        ccclass,
        property,
        requireComponent,
        disallowMultiple
      } = _decorator;

      /** 
       * DragonBones状态机组件
       */
      let AnimatorDragonBones = exports('default', (_dec = requireComponent(dragonBones.ArmatureDisplay), ccclass(_class = disallowMultiple(_class = _dec(_class = class AnimatorDragonBones extends AnimatorBase {
        constructor(...args) {
          super(...args);
          /** DragonBones组件 */
          this._dragonBones = null;
        }
        start() {
          if (!this.PlayOnStart || this._hasInit) {
            return;
          }
          this._hasInit = true;
          this._dragonBones = this.getComponent(dragonBones.ArmatureDisplay);
          this._dragonBones.addEventListener('complete', this.onAnimFinished, this);
          if (this.AssetRawUrl !== null) {
            this.initJson(this.AssetRawUrl.json);
          }
        }

        /**
         * 手动初始化状态机，可传入0-3个参数，类型如下
         * - onStateChangeCall 状态切换时的回调
         * - stateLogicMap 各个状态逻辑控制
         * - animationPlayer 自定义动画控制
         * @override
         */
        onInit(...args) {
          if (this.PlayOnStart || this._hasInit) {
            return;
          }
          this._hasInit = true;
          this.initArgs(...args);
          this._dragonBones = this.getComponent(dragonBones.ArmatureDisplay);
          this._dragonBones.addEventListener('complete', this.onAnimFinished, this);
          if (this.AssetRawUrl !== null) {
            this.initJson(this.AssetRawUrl.json);
          }
        }

        /**
         * 播放动画
         * @override
         * @param animName 动画名
         * @param loop 是否循环播放
         */
        playAnimation(animName, loop) {
          if (animName) this._dragonBones.playAnimation(animName, loop ? 0 : -1);
        }

        /**
         * 缩放动画播放速率
         * @override
         * @param scale 缩放倍率
         */
        scaleTime(scale) {
          if (scale > 0) this._dragonBones.timeScale = scale;
        }
      }) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorParams.ts", ['cc', './AnimatorCondition.ts'], function (exports) {
  var cclegacy, ParamType;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ParamType = module.ParamType;
    }],
    execute: function () {
      cclegacy._RF.push({}, "13926xryDRPXJ50lCnLvy4J", "AnimatorParams", undefined);

      /**
       * 参数结构
       */

      /**
       * 状态机参数
       */
      class AnimatorParams {
        constructor(dataArr) {
          this._paramMap = new Map();
          dataArr.forEach(data => {
            let param = {
              type: data.type,
              value: data.init
            };
            this._paramMap.set(data.param, param);
          });
        }
        getParamType(key) {
          let param = this._paramMap.get(key);
          if (param) {
            return param.type;
          } else {
            return null;
          }
        }
        setNumber(key, value) {
          let param = this._paramMap.get(key);
          if (param && param.type === ParamType.NUMBER) {
            param.value = value;
          }
        }
        setBool(key, value) {
          let param = this._paramMap.get(key);
          if (param && param.type === ParamType.BOOLEAN) {
            param.value = value ? 1 : 0;
          }
        }
        setTrigger(key) {
          let param = this._paramMap.get(key);
          if (param && param.type === ParamType.TRIGGER) {
            param.value = 1;
          }
        }
        resetTrigger(key) {
          let param = this._paramMap.get(key);
          if (param && param.type === ParamType.TRIGGER) {
            param.value = 0;
          }
        }
        autoTrigger(key) {
          let param = this._paramMap.get(key);
          if (param && param.type === ParamType.AUTO_TRIGGER) {
            param.value = 1;
          }
        }
        resetAutoTrigger(key) {
          let param = this._paramMap.get(key);
          if (param && param.type === ParamType.AUTO_TRIGGER) {
            param.value = 0;
          }
        }
        resetAllAutoTrigger() {
          this._paramMap.forEach((param, key) => {
            if (param.type === ParamType.AUTO_TRIGGER) {
              param.value = 0;
            }
          });
        }
        getNumber(key) {
          let param = this._paramMap.get(key);
          if (param && param.type === ParamType.NUMBER) {
            return param.value;
          } else {
            return 0;
          }
        }
        getBool(key) {
          let param = this._paramMap.get(key);
          if (param && param.type === ParamType.BOOLEAN) {
            return param.value;
          } else {
            return 0;
          }
        }
        getTrigger(key) {
          let param = this._paramMap.get(key);
          if (param && param.type === ParamType.TRIGGER) {
            return param.value;
          } else {
            return 0;
          }
        }
        getAutoTrigger(key) {
          let param = this._paramMap.get(key);
          if (param && param.type === ParamType.AUTO_TRIGGER) {
            return param.value;
          } else {
            return 0;
          }
        }
      }
      exports('default', AnimatorParams);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorSkeletal.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AnimatorAnimation.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, SkeletalAnimation, CCFloat, _decorator, game, AnimatorAnimation;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      SkeletalAnimation = module.SkeletalAnimation;
      CCFloat = module.CCFloat;
      _decorator = module._decorator;
      game = module.game;
    }, function (module) {
      AnimatorAnimation = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "8c545jBn4xF7LWXjl506avi", "AnimatorSkeletal", undefined);
      const {
        ccclass,
        property,
        requireComponent,
        disallowMultiple,
        menu
      } = _decorator;
      let AnimatorSkeletal = exports('AnimatorSkeletal', (_dec = requireComponent(SkeletalAnimation), _dec2 = menu('animator/AnimatorSkeletal'), _dec3 = property({
        type: CCFloat,
        tooltip: "动画切换过度时间"
      }), ccclass(_class = disallowMultiple(_class = _dec(_class = _dec2(_class = (_class2 = class AnimatorSkeletal extends AnimatorAnimation {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "duration", _descriptor, this);
          this.cross_duration = 0;
          // 防止切换动画时间少于间隔时间导致动画状态错乱的问题
          this.current_time = 0;
        }
        // 上一次切换状态时间

        onLoad() {
          this.cross_duration = this.duration * 1000;
        }

        /**
          * 播放动画
          * @override
          * @param animName 动画名
          * @param loop 是否循环播放
          */
        playAnimation(animName, loop) {
          if (!animName) {
            return;
          }
          if (game.totalTime - this.current_time > this.cross_duration) {
            this._animation.crossFade(animName, this.duration);
          } else {
            this._animation.play(animName);
          }
          this.current_time = game.totalTime;
          this._animState = this._animation.getState(animName);
          if (!this._animState) {
            return;
          }
          if (!this._wrapModeMap.has(this._animState)) {
            this._wrapModeMap.set(this._animState, this._animState.wrapMode);
          }
          // this._animState.wrapMode = loop ? 2 : this._wrapModeMap.get(this._animState)!;
          this._animState.wrapMode = loop ? 2 : 1; // 2为循环播放，1为单次播放
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "duration", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.3;
        }
      }), _class2)) || _class) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorSpine.ts", ['cc', './AnimatorBase.ts'], function (exports) {
  var cclegacy, sp, _decorator, AnimatorBase;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sp = module.sp;
      _decorator = module._decorator;
    }, function (module) {
      AnimatorBase = module.default;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "7fde8yJEfxMMqzjg+V4UVkT", "AnimatorSpine", undefined);
      const {
        ccclass,
        property,
        requireComponent,
        disallowMultiple
      } = _decorator;

      /** 
       * Spine状态机组件（主状态机），trackIndex为0
       */
      let AnimatorSpine = exports('default', (_dec = requireComponent(sp.Skeleton), ccclass(_class = disallowMultiple(_class = _dec(_class = class AnimatorSpine extends AnimatorBase {
        constructor(...args) {
          super(...args);
          /** spine组件 */
          this._spine = null;
          /** 动画完成的回调 */
          this._completeListenerMap = new Map();
          /** 次状态机注册的回调 */
          this._secondaryListenerMap = new Map();
        }
        start() {
          if (!this.PlayOnStart || this._hasInit) {
            return;
          }
          this._hasInit = true;
          this._spine = this.getComponent(sp.Skeleton);
          this._spine.setEventListener(this.onSpineEvent.bind(this));
          this._spine.setCompleteListener(this.onSpineComplete.bind(this));
          if (this.AssetRawUrl !== null) {
            this.initJson(this.AssetRawUrl.json);
          }
        }

        /**
         * 手动初始化状态机，可传入0-3个参数，类型如下
         * - onStateChangeCall 状态切换时的回调
         * - stateLogicMap 各个状态逻辑控制
         * - animationPlayer 自定义动画控制
         * @override
         */
        onInit(...args) {
          if (this.PlayOnStart || this._hasInit) {
            return;
          }
          this._hasInit = true;
          this.initArgs(...args);
          this._spine = this.getComponent(sp.Skeleton);
          this._spine.setEventListener(this.onSpineEvent.bind(this));
          this._spine.setCompleteListener(this.onSpineComplete.bind(this));
          if (this.AssetRawUrl !== null) {
            this.initJson(this.AssetRawUrl.json);
          }
        }

        /** ---------- 后续扩展代码 开始 ---------- */

        getBone(name) {
          var bone = this._spine.findBone(name);
          return bone;
        }
        onSpineEvent(trackEntry, event) {
          var _this$_animationPlaye;
          var animationName = trackEntry.animation ? event.data.name : "";
          (_this$_animationPlaye = this._animationPlayer) == null || _this$_animationPlaye.onFrameEventCallback(animationName, this);
        }

        /** ---------- 后续扩展代码 结束 ---------- */

        onSpineComplete(entry) {
          entry.trackIndex === 0 && this.onAnimFinished();
          this._completeListenerMap.forEach((target, cb) => {
            target ? cb.call(target, entry) : cb(entry);
          });
          this._secondaryListenerMap.forEach((target, cb) => {
            entry.trackIndex === target.TrackIndex && cb.call(target, entry);
          });
        }

        /**
         * 播放动画
         * @override
         * @param animName 动画名
         * @param loop 是否循环播放
         */
        playAnimation(animName, loop) {
          if (animName) {
            this._spine.setAnimation(0, animName, loop);
          } else {
            this._spine.clearTrack(0);
          }
        }

        /**
         * 缩放动画播放速率
         * @override
         * @param scale 缩放倍率
         */
        scaleTime(scale) {
          if (scale > 0) this._spine.timeScale = scale;
        }

        /**
         * 注册次状态机动画结束的回调（状态机内部方法，不能由外部直接调用）
         */
        addSecondaryListener(cb, target) {
          this._secondaryListenerMap.set(cb, target);
        }

        /**
         * 注册动画完成时的监听
         * @param cb 回调
         * @param target 调用回调的this对象
         */
        addCompleteListener(cb, target = null) {
          if (this._completeListenerMap.has(cb)) {
            return;
          }
          this._completeListenerMap.set(cb, target);
        }

        /**
         * 注销动画完成的监听
         * @param cb 回调
         */
        removeCompleteListener(cb) {
          this._completeListenerMap.delete(cb);
        }

        /**
         * 清空动画完成的监听
         */
        clearCompleteListener() {
          this._completeListenerMap.clear;
        }
      }) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorSpineSecondary.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AnimatorSpine.ts', './AnimatorBase.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, sp, _decorator, AnimatorSpine, AnimatorBase;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      sp = module.sp;
      _decorator = module._decorator;
    }, function (module) {
      AnimatorSpine = module.default;
    }, function (module) {
      AnimatorBase = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "e47112s9c9Kwo8XQQ4KSW0c", "AnimatorSpineSecondary", undefined);
      const {
        ccclass,
        property,
        requireComponent
      } = _decorator;

      /** 
       * Spine状态机组件（次状态机），同一节点可添加多个，用于在不同track中播放动画，trackIndex必须大于0
       */
      let AnimatorSpineSecondary = exports('default', (_dec = requireComponent(sp.Skeleton), _dec2 = property({
        tooltip: '动画播放的trackIndex，必须大于0'
      }), ccclass(_class = _dec(_class = (_class2 = class AnimatorSpineSecondary extends AnimatorBase {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "TrackIndex", _descriptor, this);
          /** 主状态机 */
          this._main = null;
          /** spine组件 */
          this._spine = null;
        }
        start() {
          if (!this.PlayOnStart || this._hasInit) {
            return;
          }
          this._hasInit = true;
          this._spine = this.getComponent(sp.Skeleton);
          this._main = this.getComponent(AnimatorSpine);
          this._main.addSecondaryListener(this.onAnimFinished, this);
          if (this.AssetRawUrl !== null) {
            this.initJson(this.AssetRawUrl.json);
          }
        }

        /**
         * 手动初始化状态机，可传入0-3个参数，类型如下
         * - onStateChangeCall 状态切换时的回调
         * - stateLogicMap 各个状态逻辑控制
         * - animationPlayer 自定义动画控制
         * @override
         */
        onInit(...args) {
          if (this.PlayOnStart || this._hasInit) {
            return;
          }
          this._hasInit = true;
          this.initArgs(...args);
          this._spine = this.getComponent(sp.Skeleton);
          this._main = this.getComponent(AnimatorSpine);
          this._main.addSecondaryListener(this.onAnimFinished, this);
          if (this.AssetRawUrl !== null) {
            this.initJson(this.AssetRawUrl.json);
          }
        }

        /**
         * 播放动画
         * @override
         * @param animName 动画名
         * @param loop 是否循环播放
         */
        playAnimation(animName, loop) {
          if (animName) {
            this._spine.setAnimation(this.TrackIndex, animName, loop);
          } else {
            this._spine.clearTrack(this.TrackIndex);
          }
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "TrackIndex", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorState.ts", ['cc', './AnimatorTransition.ts'], function (exports) {
  var cclegacy, AnimatorTransition;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      AnimatorTransition = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "bd2d1/E71JL1Jj3HzsYH82H", "AnimatorState", undefined);

      /**
       * 状态管理类
       */
      class AnimatorState {
        /** 状态名 */
        get name() {
          return this._name;
        }
        /** 动画名 */
        get motion() {
          return this._motion;
        }
        /** 动画是否循环播放 */
        get loop() {
          return this._loop;
        }
        /** 动画播放速度的混合参数 */
        get multi() {
          return this._multi;
        }
        /** 动画播放速度 */
        get speed() {
          return this._speed;
        }
        set speed(value) {
          this._speed = value;
        }
        constructor(data, ac) {
          this._name = "";
          this._motion = "";
          this._loop = false;
          this._speed = 1;
          this._multi = "";
          this._transitions = [];
          this._ac = null;
          this._name = data.state;
          this._motion = data.motion || '';
          this._loop = data.loop || false;
          this._speed = data.speed || 1;
          this._multi = data.multiplier || '';
          this._ac = ac;
          for (let i = 0; i < data.transitions.length; i++) {
            let transition = new AnimatorTransition(data.transitions[i], ac);
            transition.isValid() && this._transitions.push(transition);
          }
        }

        /**
         * 判断各个分支是否满足条件，满足则转换状态
         */
        checkAndTrans() {
          for (let i = 0; i < this._transitions.length; i++) {
            let transition = this._transitions[i];
            if (transition && transition.check()) {
              transition.doTrans();
              return;
            }
          }
        }
      }
      exports('default', AnimatorState);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorStateLogic.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b06fbd3UdNKvooAUeDi9UTc", "AnimatorStateLogic", undefined);
      /**
       * 状态逻辑基类
       */
      class AnimatorStateLogic {
        /**
         * 进入状态时调用
         * @virtual
         */
        onEntry() {}

        /**
         * 每次状态机逻辑更新时调用
         * @virtual
         */
        onUpdate() {}

        /**
         * 离开状态时调用
         * @virtual
         */
        onExit() {}
      }
      exports('AnimatorStateLogic', AnimatorStateLogic);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimatorTransition.ts", ['cc', './AnimatorCondition.ts'], function (exports) {
  var cclegacy, AnimatorCondition, ParamType;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      AnimatorCondition = module.default;
      ParamType = module.ParamType;
    }],
    execute: function () {
      cclegacy._RF.push({}, "39224xRIkpEG7hvPJlKoGDy", "AnimatorTransition", undefined);
      /**
       * 状态过渡类
       */
      class AnimatorTransition {
        constructor(data, ac) {
          this._toStateName = '';
          this._hasExitTime = false;
          this._conditions = [];
          this._ac = null;
          this._toStateName = data.toState;
          this._hasExitTime = data.hasExitTime;
          this._ac = ac;
          for (let i = 0; i < data.conditions.length; i++) {
            let condition = new AnimatorCondition(data.conditions[i], ac);
            this._conditions.push(condition);
          }
        }

        /**
         * 返回该transition是否有效，当未勾选hasExitTime以及没有添加任何condition时此transition无效并忽略
         */
        isValid() {
          return this._hasExitTime || this._conditions.length > 0;
        }

        /**
         * 判断是否满足所有转换条件
         */
        check() {
          if (this._toStateName === this._ac.curState.name) {
            return false;
          }
          if (this._hasExitTime && (this._ac.curState !== this._ac.animCompleteState || !this._ac.animComplete)) {
            return false;
          }
          for (let i = 0; i < this._conditions.length; i++) {
            if (!this._conditions[i].check()) {
              return false;
            }
          }
          return true;
        }

        /**
         * 转换状态
         */
        doTrans() {
          // 满足条件时重置动画播完标记
          if (this._hasExitTime) {
            this._ac.animComplete = false;
          }
          // 满足状态转换条件时重置trigger和autoTrigger
          for (let i = 0; i < this._conditions.length; i++) {
            let type = this._conditions[i].getParamType();
            let name = this._conditions[i].getParamName();
            if (type === ParamType.TRIGGER) {
              this._ac.params.resetTrigger(name);
            } else if (type === ParamType.AUTO_TRIGGER) {
              this._ac.params.resetAutoTrigger(name);
            }
          }
          this._ac.changeState(this._toStateName);
        }
      }
      exports('default', AnimatorTransition);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ArrayExt.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2696fVV0U1BcotwtuSW7qe9", "ArrayExt", undefined);
      // @ts-ignore
      !Array.prototype.__cc_extended && Object.defineProperties(Array.prototype, {
        remove: {
          value: function (filter) {
            if (typeof filter == 'function') {
              for (let i = this.length - 1; i > -1; --i) {
                filter(this[i], i, this) && this.splice(i, 1);
              }
            } else {
              for (let i = this.length - 1; i > -1; --i) {
                this[i] === filter && this.splice(i, 1);
              }
            }
            return this;
          }
        },
        removeOne: {
          value: function (filter) {
            if (typeof filter == 'function') {
              for (let i = 0; i < this.length; ++i) {
                if (filter(this[i], i, this)) {
                  this.splice(i, 1);
                  return this;
                }
              }
            } else {
              for (let i = 0; i < this.length; ++i) {
                if (this[i] === filter) {
                  this.splice(i, 1);
                  return this;
                }
              }
            }
            return this;
          }
        },
        random: {
          value: function () {
            let element = this[Math.floor(Math.random() * this.length)];
            return element;
          }
        },
        fastRemoveAt: {
          value: function (index) {
            const length = this.length;
            if (index < 0 || index >= length) {
              return null;
            }
            let res = this[index];
            this[index] = this[length - 1];
            this.length = length - 1;
            return res;
          }
        },
        fastRemove: {
          value: function (value) {
            const index = this.indexOf(value);
            if (index >= 0) {
              this[index] = this[this.length - 1];
              --this.length;
              return true;
            }
            return false;
          }
        },
        first: {
          value: function () {
            return this.length ? this[0] : null;
          }
        },
        last: {
          value: function () {
            return this.length ? this[this.length - 1] : null;
          }
        },
        max: {
          value: function (mapper) {
            if (!this.length) {
              return null;
            }
            function _max(a, b) {
              return a > b ? a : b;
            }
            if (typeof mapper == 'function') {
              let max = mapper(this[0], 0, this);
              for (let i = 1; i < this.length; ++i) {
                let temp = mapper(this[i], i, this);
                max = temp > max ? temp : max;
              }
              return max;
            } else {
              return this.reduce(function (prev, cur) {
                return _max(prev, cur);
              });
            }
          }
        },
        min: {
          value: function (mapper) {
            if (!this.length) {
              return null;
            }
            function _min(a, b) {
              return a < b ? a : b;
            }
            if (typeof mapper == 'function') {
              let min = mapper(this[0], 0, this);
              for (let i = 1; i < this.length; ++i) {
                let temp = mapper(this[i], i, this);
                min = temp < min ? temp : min;
              }
              return min;
            } else {
              return this.reduce(function (prev, cur) {
                return _min(prev, cur);
              });
            }
          }
        },
        distinct: {
          value: function () {
            return this.filter(function (v, i, arr) {
              return arr.indexOf(v) === i;
            });
          }
        },
        filterIndex: {
          value: function (filter) {
            let output = [];
            for (let i = 0; i < this.length; ++i) {
              if (filter(this[i], i, this)) {
                output.push(i);
              }
            }
            return output;
          }
        },
        count: {
          value: function (filter) {
            let result = 0;
            for (let i = 0; i < this.length; ++i) {
              if (filter(this[i], i, this)) {
                ++result;
              }
            }
            return result;
          }
        },
        sum: {
          value: function (mapper) {
            let result = 0;
            for (let i = 0; i < this.length; ++i) {
              result += mapper ? mapper(this[i], i, this) : this[i];
            }
            return result;
          }
        },
        average: {
          value: function (mapper) {
            return this.sum(mapper) / this.length;
          }
        },
        orderBy: {
          value: function () {
            let mappers = [];
            for (let _i = 0; _i < arguments.length; _i++) {
              mappers[_i] = arguments[_i];
            }
            return this.slice().sort(function (a, b) {
              for (let i = 0; i < mappers.length; ++i) {
                let va = mappers[i](a);
                let vb = mappers[i](b);
                if (va > vb) {
                  return 1;
                } else if (va < vb) {
                  return -1;
                }
              }
              return 0;
            });
          }
        },
        orderByDesc: {
          value: function () {
            let mappers = [];
            for (let _i = 0; _i < arguments.length; _i++) {
              mappers[_i] = arguments[_i];
            }
            return this.slice().sort(function (a, b) {
              for (let i = 0; i < mappers.length; ++i) {
                let va = mappers[i](a);
                let vb = mappers[i](b);
                if (va > vb) {
                  return -1;
                } else if (va < vb) {
                  return 1;
                }
              }
              return 0;
            });
          }
        },
        binarySearch: {
          value: function (value, keyMapper) {
            let low = 0,
              high = this.length - 1;
            while (low <= high) {
              let mid = (high + low) / 2 | 0;
              let midValue = keyMapper ? keyMapper(this[mid]) : this[mid];
              if (value === midValue) {
                return mid;
              } else if (value > midValue) {
                low = mid + 1;
              } else if (value < midValue) {
                high = mid - 1;
              }
            }
            return -1;
          }
        },
        binaryInsert: {
          value: function (item, keyMapper, unique) {
            if (typeof keyMapper == 'boolean') {
              unique = keyMapper;
              keyMapper = undefined;
            }
            let low = 0,
              high = this.length - 1;
            let mid = NaN;
            let itemValue = keyMapper ? keyMapper(item) : item;
            while (low <= high) {
              mid = (high + low) / 2 | 0;
              let midValue = keyMapper ? keyMapper(this[mid]) : this[mid];
              if (itemValue === midValue) {
                if (unique) {
                  return mid;
                } else {
                  break;
                }
              } else if (itemValue > midValue) {
                low = mid + 1;
              } else if (itemValue < midValue) {
                high = mid - 1;
              }
            }
            let index = low > mid ? mid + 1 : mid;
            this.splice(index, 0, item);
            return index;
          }
        },
        binaryDistinct: {
          value: function (keyMapper) {
            return this.filter(function (v, i, arr) {
              return arr.binarySearch(v, keyMapper) === i;
            });
          }
        },
        findLast: {
          value: function (predicate) {
            for (let i = this.length - 1; i > -1; --i) {
              if (predicate(this[i], i, this)) {
                return this[i];
              }
            }
            return undefined;
          }
        },
        findLastIndex: {
          value: function (predicate) {
            for (let i = this.length - 1; i > -1; --i) {
              if (predicate(this[i], i, this)) {
                return i;
              }
            }
            return -1;
          }
        },
        groupBy: {
          value: function (grouper) {
            let group = this.reduce(function (prev, next) {
              let groupKey = grouper(next);
              if (!prev[groupKey]) {
                prev[groupKey] = [];
              }
              prev[groupKey].push(next);
              return prev;
            }, {});
            return Object.keys(group).map(function (key) {
              let arr = group[key];
              arr.key = key;
              return arr;
            });
          }
        },
        __cc_extended: {
          value: true
        }
      });
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ArrayUtil.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "4613b2zY/dMSaGPBGo6eti3", "ArrayUtil", undefined);
      /*
       * @Author: dgflash
       * @Date: 2021-08-11 16:41:12
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-02 14:50:57
       */

      /** 数组工具 */
      class ArrayUtil {
        /**
         * 数组去重，并创建一个新数组返回
         * @param arr  源数组
         */
        static noRepeated(arr) {
          var res = [arr[0]];
          for (var i = 1; i < arr.length; i++) {
            var repeat = false;
            for (var j = 0; j < res.length; j++) {
              if (arr[i] == res[j]) {
                repeat = true;
                break;
              }
            }
            if (!repeat) {
              res.push(arr[i]);
            }
          }
          return res;
        }

        /**
         * 复制二维数组
         * @param array 目标数组 
         */
        static copy2DArray(array) {
          let newArray = [];
          for (let i = 0; i < array.length; i++) {
            newArray.push(array[i].concat());
          }
          return newArray;
        }

        /**
         * Fisher-Yates Shuffle 随机置乱算法
         * @param array 目标数组
         */
        static fisherYatesShuffle(array) {
          let count = array.length;
          while (count) {
            let index = Math.floor(Math.random() * count--);
            let temp = array[count];
            array[count] = array[index];
            array[index] = temp;
          }
          return array;
        }

        /**
         * 混淆数组
         * @param array 目标数组
         */
        static confound(array) {
          let result = array.slice().sort(() => Math.random() - .5);
          return result;
        }

        /**
         * 数组扁平化
         * @param array 目标数组
         */
        static flattening(array) {
          for (; array.some(v => Array.isArray(v));) {
            // 判断 array 中是否有数组
            array = [].concat.apply([], array); // 压扁数组
          }

          return array;
        }

        /** 删除数组中指定项 */
        static removeItem(array, item) {
          var temp = array.concat();
          for (let i = 0; i < temp.length; i++) {
            const value = temp[i];
            if (item == value) {
              array.splice(i, 1);
              break;
            }
          }
        }

        /**
         * 合并数组
         * @param array1 目标数组1
         * @param array2 目标数组2
         */
        static combineArrays(array1, array2) {
          let newArray = [...array1, ...array2];
          return newArray;
        }

        /**
         * 获取随机数组成员
         * @param array 目标数组
         */
        static getRandomValueInArray(array) {
          let newArray = array[Math.floor(Math.random() * array.length)];
          return newArray;
        }
      }
      exports('ArrayUtil', ArrayUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AsyncQueue.ts", ['cc'], function (exports) {
  var cclegacy, warn, log;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      warn = module.warn;
      log = module.log;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8c48bBN521JzIxhITJunFji", "AsyncQueue", undefined);
      /**
       * 异步队列处理
       * @example
      var queue: AsyncQueue = new AsyncQueue();
      queue.push((next: NextFunction, params: any, args: any) => {
          oops.res.load("language/font/" + oops.language.current, next);
      });
      queue.push((next: NextFunction, params: any, args: any) => {
          oops.res.loadDir("common", next);
      });
      queue.complete =  () => {
          console.log("处理完成");
      };
      queue.play();
       */
      class AsyncQueue {
        constructor() {
          // 正在运行的任务
          this._runningAsyncTask = null;
          this._queues = [];
          // 正在执行的异步任务标识
          this._isProcessingTaskUUID = 0;
          this._enable = true;
          /**
           * 任务队列完成回调
           */
          this.complete = null;
        }
        /** 任务队列 */
        get queues() {
          return this._queues;
        }
        /** 是否开启可用 */
        get enable() {
          return this._enable;
        }
        /** 是否开启可用 */
        set enable(val) {
          if (this._enable === val) {
            return;
          }
          this._enable = val;
          if (val && this.size > 0) {
            this.play();
          }
        }
        /**
         * 添加一个异步任务到队列中
         * @param callback  回调
         * @param params    参数
         */
        push(callback, params = null) {
          let uuid = AsyncQueue._$uuid_count++;
          this._queues.push({
            uuid: uuid,
            callbacks: [callback],
            params: params
          });
          return uuid;
        }

        /**
         * 添加多个任务，多个任务函数会同时执行
         * @param params     参数据
         * @param callbacks  回调
         * @returns 
         */
        pushMulti(params, ...callbacks) {
          let uuid = AsyncQueue._$uuid_count++;
          this._queues.push({
            uuid: uuid,
            callbacks: callbacks,
            params: params
          });
          return uuid;
        }

        /**
         * 移除一个还未执行的异步任务
         * @param uuid  任务唯一编号
         */
        remove(uuid) {
          var _this$_runningAsyncTa;
          if (((_this$_runningAsyncTa = this._runningAsyncTask) == null ? void 0 : _this$_runningAsyncTa.uuid) === uuid) {
            warn("正在执行的任务不可以移除");
            return;
          }
          for (let i = 0; i < this._queues.length; i++) {
            if (this._queues[i].uuid === uuid) {
              this._queues.splice(i, 1);
              break;
            }
          }
        }

        /** 队列长度 */
        get size() {
          return this._queues.length;
        }

        /** 是否有正在处理的任务 */
        get isProcessing() {
          return this._isProcessingTaskUUID > 0;
        }

        /** 队列是否已停止 */
        get isStop() {
          if (this._queues.length > 0) {
            return false;
          }
          if (this.isProcessing) {
            return false;
          }
          return true;
        }

        /** 正在执行的任务参数 */
        get runningParams() {
          if (this._runningAsyncTask) {
            return this._runningAsyncTask.params;
          }
          return null;
        }

        /** 清空队列 */
        clear() {
          this._queues = [];
          this._isProcessingTaskUUID = 0;
          this._runningAsyncTask = null;
        }

        /** 跳过当前正在执行的任务 */
        step() {
          if (this.isProcessing) {
            this.next(this._isProcessingTaskUUID);
          }
        }

        /**
         * 开始运行队列
         * @param args  参数
         */
        play(args = null) {
          if (this.isProcessing) {
            return;
          }
          if (!this._enable) {
            return;
          }
          let actionData = this._queues.shift();
          if (actionData) {
            this._runningAsyncTask = actionData;
            let taskUUID = actionData.uuid;
            this._isProcessingTaskUUID = taskUUID;
            let callbacks = actionData.callbacks;
            if (callbacks.length == 1) {
              let nextFunc = (nextArgs = null) => {
                this.next(taskUUID, nextArgs);
              };
              callbacks[0](nextFunc, actionData.params, args);
            } else {
              // 多个任务函数同时执行
              let fnum = callbacks.length;
              let nextArgsArr = [];
              let nextFunc = (nextArgs = null) => {
                --fnum;
                nextArgsArr.push(nextArgs || null);
                if (fnum === 0) {
                  this.next(taskUUID, nextArgsArr);
                }
              };
              let knum = fnum;
              for (let i = 0; i < knum; i++) {
                callbacks[i](nextFunc, actionData.params, args);
              }
            }
          } else {
            this._isProcessingTaskUUID = 0;
            this._runningAsyncTask = null;
            if (this.complete) {
              this.complete(args);
            }
          }
        }

        /**
         * 往队列中push一个延时任务
         * @param time 毫秒时间
         * @param callback （可选参数）时间到了之后回调
         */
        yieldTime(time, callback = null) {
          let task = function (next, params, args) {
            let _t = setTimeout(() => {
              clearTimeout(_t);
              if (callback) {
                callback();
              }
              next(args);
            }, time);
          };
          this.push(task, {
            des: "AsyncQueue.yieldTime"
          });
        }
        next(taskUUID, args = null) {
          if (this._isProcessingTaskUUID === taskUUID) {
            this._isProcessingTaskUUID = 0;
            this._runningAsyncTask = null;
            this.play(args);
          } else {
            if (this._runningAsyncTask) {
              log(this._runningAsyncTask);
            }
          }
        }

        /**
         * 返回一个执行函数，执行函数调用count次后，next将触发
         * @param count 
         * @param next 
         * @return 返回一个匿名函数
         */
        static excuteTimes(count, next = null) {
          let fnum = count;
          let call = () => {
            --fnum;
            if (fnum === 0) {
              next && next();
            }
          };
          return call;
        }
      }
      exports('AsyncQueue', AsyncQueue);
      // 任务task的唯一标识
      AsyncQueue._$uuid_count = 1;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AudioEffect.ts", ['cc', './Oops.ts'], function (exports) {
  var cclegacy, AudioSource, AudioClip, error, _decorator, oops;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      AudioSource = module.AudioSource;
      AudioClip = module.AudioClip;
      error = module.error;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "e52d2ysY1BEbpcT2Cz0Wwss", "AudioEffect", undefined);
      const {
        ccclass,
        menu
      } = _decorator;

      /**
       * 注：用playOneShot播放的音乐效果，在播放期间暂时没办法即时关闭音乐
       */

      /** 游戏音效 */
      let AudioEffect = exports('AudioEffect', (_dec = ccclass('AudioEffect'), _dec(_class = class AudioEffect extends AudioSource {
        constructor(...args) {
          super(...args);
          this.effects = new Map();
          this._progress = 0;
        }
        /** 获取音乐播放进度 */
        get progress() {
          if (this.duration > 0) this._progress = this.currentTime / this.duration;
          return this._progress;
        }
        /**
         * 设置音乐当前播放进度
         * @param value     进度百分比0到1之间
         */
        set progress(value) {
          this._progress = value;
          this.currentTime = value * this.duration;
        }

        /**
         * 加载音效并播放
         * @param url           音效资源地址
         * @param callback      资源加载完成并开始播放回调
         */
        load(url, callback) {
          oops.res.load(url, AudioClip, (err, data) => {
            if (err) {
              error(err);
            }
            this.effects.set(url, data);
            this.playOneShot(data, this.volume);
            callback && callback();
          });
        }

        /** 释放所有已使用过的音效资源 */
        releaseAll() {
          for (let key in this.effects) {
            oops.res.release(key);
          }
          this.effects.clear();
        }

        /**
         * 释放指定地址音效资源
         * @param url           音效资源地址
         */
        release(url) {
          if (this.effects.has(url)) {
            this.effects.delete(url);
            oops.res.release(url);
          }
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AudioManager.ts", ['cc', './Oops.ts', './AudioEffect.ts', './AudioMusic.ts'], function (exports) {
  var cclegacy, Component, oops, AudioEffect, AudioMusic;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      AudioEffect = module.AudioEffect;
    }, function (module) {
      AudioMusic = module.AudioMusic;
    }],
    execute: function () {
      cclegacy._RF.push({}, "252f0z+vPNL8Y/jsLYmomtw", "AudioManager", undefined);
      const LOCAL_STORE_KEY = "game_audio";

      /** 
       * 音频管理
       * @example 
      // 模块功能通过 oops.audio 调用
      oops.audio.playMusic("audios/nocturne");
       */
      class AudioManager extends Component {
        constructor(...args) {
          super(...args);
          this.music = null;
          this.effect = null;
          this.local_data = {};
          this._volume_music = 1;
          this._volume_effect = 1;
          this._switch_music = true;
          this._switch_effect = true;
        }
        /**
         * 设置背景音乐播放完成回调
         * @param callback 背景音乐播放完成回调
         */
        setMusicComplete(callback = null) {
          this.music.onComplete = callback;
        }

        /**
         * 播放背景音乐
         * @param url        资源地址
         * @param callback   音乐播放完成事件
         */
        playMusic(url, callback) {
          if (this._switch_music && !this.music.playing) {
            this.music.loop = false;
            this.music.load(url, callback);
          }
        }

        /** 循环播放背景音乐 */
        playMusicLoop(url) {
          if (this._switch_music && !this.music.playing) {
            this.music.loop = true;
            this.music.load(url);
          }
        }

        /** 停止背景音乐播放 */
        stopMusic() {
          if (this._switch_music && this.music.playing) {
            this.music.stop();
          }
        }

        /**
         * 获取背景音乐播放进度
         */
        get progressMusic() {
          return this.music.progress;
        }
        /**
         * 设置背景乐播放进度
         * @param value     播放进度值
         */
        set progressMusic(value) {
          this.music.progress = value;
        }

        /**
         * 获取背景音乐音量
         */
        get volumeMusic() {
          return this._volume_music;
        }
        /** 
         * 设置背景音乐音量
         * @param value     音乐音量值
         */
        set volumeMusic(value) {
          this._volume_music = value;
          this.music.volume = value;
        }

        /** 
         * 获取背景音乐开关值 
         */
        get switchMusic() {
          return this._switch_music;
        }
        /** 
         * 设置背景音乐开关值
         * @param value     开关值
         */
        set switchMusic(value) {
          this._switch_music = value;
          if (value == false) this.music.stop();
        }

        /**
         * 播放音效
         * @param url        资源地址
         */
        playEffect(url) {
          if (this._switch_effect) {
            this.effect.load(url);
          }
        }

        /** 
         * 获取音效音量 
         */
        get volumeEffect() {
          return this._volume_effect;
        }
        /**
         * 设置获取音效音量
         * @param value     音效音量值
         */
        set volumeEffect(value) {
          this._volume_effect = value;
          this.effect.volume = value;
        }

        /** 
         * 获取音效开关值 
         */
        get switchEffect() {
          return this._switch_effect;
        }
        /**
         * 设置音效开关值
         * @param value     音效开关值
         */
        set switchEffect(value) {
          this._switch_effect = value;
          if (value == false) this.effect.stop();
        }

        /** 恢复当前暂停的音乐与音效播放 */
        resumeAll() {
          if (this.music) {
            if (!this.music.playing && this.music.progress > 0) this.music.play();
            if (!this.effect.playing && this.effect.progress > 0) this.effect.play();
          }
        }

        /** 暂停当前音乐与音效的播放 */
        pauseAll() {
          if (this.music) {
            if (this.music.playing) this.music.pause();
            if (this.effect.playing) this.effect.pause();
          }
        }

        /** 停止当前音乐与音效的播放 */
        stopAll() {
          if (this.music) {
            this.music.stop();
            this.effect.stop();
          }
        }

        /** 保存音乐音效的音量、开关配置数据到本地 */
        save() {
          this.local_data.volume_music = this._volume_music;
          this.local_data.volume_effect = this._volume_effect;
          this.local_data.switch_music = this._switch_music;
          this.local_data.switch_effect = this._switch_effect;
          oops.storage.set(LOCAL_STORE_KEY, this.local_data);
        }

        /** 本地加载音乐音效的音量、开关配置数据并设置到游戏中 */
        load() {
          this.music = this.getComponent(AudioMusic) || this.addComponent(AudioMusic);
          this.effect = this.getComponent(AudioEffect) || this.addComponent(AudioEffect);
          this.local_data = oops.storage.getJson(LOCAL_STORE_KEY);
          if (this.local_data) {
            try {
              this.setState();
            } catch (e) {
              this.setStateDefault();
            }
          } else {
            this.setStateDefault();
          }
          if (this.music) this.music.volume = this._volume_music;
          if (this.effect) this.effect.volume = this._volume_effect;
        }
        setState() {
          this._volume_music = this.local_data.volume_music;
          this._volume_effect = this.local_data.volume_effect;
          this._switch_music = this.local_data.switch_music;
          this._switch_effect = this.local_data.switch_effect;
        }
        setStateDefault() {
          this.local_data = {};
          this._volume_music = 1;
          this._volume_effect = 1;
          this._switch_music = true;
          this._switch_effect = true;
        }
      }
      exports('AudioManager', AudioManager);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AudioMusic.ts", ['cc', './Oops.ts'], function (exports) {
  var cclegacy, AudioSource, AudioClip, error, _decorator, oops;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      AudioSource = module.AudioSource;
      AudioClip = module.AudioClip;
      error = module.error;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "5c1f3kqGetBiIv48/CvuaQv", "AudioMusic", undefined);
      const {
        ccclass,
        menu
      } = _decorator;

      /** 背景音乐 */
      let AudioMusic = exports('AudioMusic', (_dec = ccclass('AudioMusic'), _dec(_class = class AudioMusic extends AudioSource {
        constructor(...args) {
          super(...args);
          /** 背景音乐播放完成回调 */
          this.onComplete = null;
          this._progress = 0;
          this._url = null;
          this._isPlay = false;
        }
        /** 获取音乐播放进度 */
        get progress() {
          if (this.duration > 0) this._progress = this.currentTime / this.duration;
          return this._progress;
        }
        /**
         * 设置音乐当前播放进度
         * @param value     进度百分比0到1之间
         */
        set progress(value) {
          this._progress = value;
          this.currentTime = value * this.duration;
        }

        /**
         * 加载音乐并播放
         * @param url          音乐资源地址
         * @param callback     加载完成回调
         */
        load(url, callback) {
          if (this._url == null) {
            oops.res.load(url, AudioClip, (err, data) => {
              if (err) {
                error(err);
              }

              // 注：事件定义在这里，是为了在播放前设置初始播放位置数据
              callback && callback();
              this.playPrepare(url, data);
            });
          } else {
            this.playPrepare(url, this.clip);
          }
        }

        /** 停止音乐播放 */
        stop() {
          this._url = null;
          super.stop();
        }
        playPrepare(url, data) {
          if (this.playing) {
            this._isPlay = false;
            this.stop();
          }
          if (this._url) {
            this.clip = null;
            oops.res.release(this._url);
          }
          this.enabled = true;
          this.clip = data;
          this.play();
          this._url = url;
        }

        /** cc.Component 生命周期方法，验证背景音乐播放完成逻辑，建议不要主动调用 */
        update(dt) {
          if (this.currentTime > 0) {
            this._isPlay = true;
          }
          if (this._isPlay && this.playing == false && this.progress == 0) {
            this._isPlay = false;
            this.enabled = false;
            this.clip = null;
            this._url = null;
            this.onComplete && this.onComplete();
          }
        }

        /** 释放当前背景音乐资源 */
        release() {
          if (this._url) {
            this.clip = null;
            oops.res.release(this._url);
            this._url = null;
          }
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Badge.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './RoundRectMask.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Enum, SpriteFrame, CCInteger, _decorator, Component, color, UITransform, Vec3, Label, Node, Layers, Mask, Sprite, Overflow, RoundRectMask;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Enum = module.Enum;
      SpriteFrame = module.SpriteFrame;
      CCInteger = module.CCInteger;
      _decorator = module._decorator;
      Component = module.Component;
      color = module.color;
      UITransform = module.UITransform;
      Vec3 = module.Vec3;
      Label = module.Label;
      Node = module.Node;
      Layers = module.Layers;
      Mask = module.Mask;
      Sprite = module.Sprite;
      Overflow = module.Overflow;
    }, function (module) {
      RoundRectMask = module.RoundRectMask;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _class3;
      cclegacy._RF.push({}, "bac76ow94VI+IpAB1DQUKfq", "Badge", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      // 徽标位置
      let Position = exports('Position', /*#__PURE__*/function (Position) {
        Position[Position["TOP_LEFT"] = 0] = "TOP_LEFT";
        Position[Position["TOP_RIGHT"] = 1] = "TOP_RIGHT";
        return Position;
      }({}));
      Enum(Position);
      let Badge = exports('Badge', (_dec = ccclass('Badge'), _dec2 = property({
        type: SpriteFrame,
        tooltip: '背景'
      }), _dec3 = property({
        tooltip: '内容'
      }), _dec4 = property({
        type: CCInteger,
        tooltip: '宽'
      }), _dec5 = property({
        type: CCInteger,
        tooltip: '高'
      }), _dec6 = property({
        type: CCInteger,
        tooltip: '圆角'
      }), _dec7 = property({
        type: Position,
        tooltip: '位置\n 0: 左上角 \n 1: 右上角'
      }), _dec(_class = (_class2 = (_class3 = class Badge extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "bg", _descriptor, this);
          _initializerDefineProperty(this, "string", _descriptor2, this);
          _initializerDefineProperty(this, "width", _descriptor3, this);
          _initializerDefineProperty(this, "height", _descriptor4, this);
          _initializerDefineProperty(this, "radius", _descriptor5, this);
          _initializerDefineProperty(this, "position", _descriptor6, this);
          this.badgeNode = null;
          this.color = color(214, 30, 30, 240);
          this.textColor = color(255, 255, 255, 255);
          this.labelNode = null;
        }
        get text() {
          return this.string;
        }
        set text(text) {
          this.string = text;
          this.setText(text);
        }
        onLoad() {
          this.initBadge();
        }

        // 初始化badge，插入节点等操作
        initBadge() {
          const badgeNode = this.createBadge();
          this.node.addChild(badgeNode);
        }

        // 设置位置
        setPosition(position) {
          var _this$node$getCompone, _this$badgeNode$getCo;
          const parentSize = (_this$node$getCompone = this.node.getComponent(UITransform)) == null ? void 0 : _this$node$getCompone.contentSize;
          const badgeSize = (_this$badgeNode$getCo = this.badgeNode.getComponent(UITransform)) == null ? void 0 : _this$badgeNode$getCo.contentSize;
          switch (position) {
            case Position.TOP_LEFT:
              {
                const x = -parentSize.width / 2;
                const y = parentSize.height / 2;
                this.badgeNode.setPosition(new Vec3(x, y, 0));
                break;
              }
            case Position.TOP_RIGHT:
              {
                const x = parentSize.width / 2;
                const y = parentSize.height / 2;
                this.badgeNode.setPosition(new Vec3(x, y, 0));
                break;
              }
          }
        }

        // 设置文字
        setText(text) {
          this.text = text;
          const label = this.labelNode.getComponent(Label);
          if (label) {
            label.string = this.text;
            label.color = this.textColor;
          }
          return this;
        }
        createBadge() {
          var _this$badgeNode$getCo2, _backgroundNode$getCo, _label$getComponent;
          this.badgeNode = new Node('BadgeNode');
          const backgroundNode = new Node('backgroundNode');
          this.labelNode = new Node('labelNode');
          this.badgeNode.layer = Layers.Enum.UI_2D;
          backgroundNode.layer = Layers.Enum.UI_2D;
          this.labelNode.layer = Layers.Enum.UI_2D;

          // 设置mask
          this.badgeNode.addComponent(Mask);
          this.badgeNode.addComponent(RoundRectMask).radius = this.radius;
          (_this$badgeNode$getCo2 = this.badgeNode.getComponent(UITransform)) == null || _this$badgeNode$getCo2.setContentSize(this.width, this.height);
          this.badgeNode.active = true;

          // 设置背景
          const _sprite = backgroundNode.addComponent(Sprite);
          _sprite.type = Sprite.Type.SIMPLE;
          _sprite.color = this.color;
          _sprite.spriteFrame = this.bg;
          (_backgroundNode$getCo = backgroundNode.getComponent(UITransform)) == null || _backgroundNode$getCo.setContentSize(this.width, this.height);

          // 设置label信息
          const _label = this.labelNode.addComponent(Label);
          (_label$getComponent = _label.getComponent(UITransform)) == null || _label$getComponent.setContentSize(this.width, this.height);
          _label.string = this.text;
          _label.color = this.textColor;
          _label.fontSize = 18;
          _label.isBold = true;
          _label.horizontalAlign = Label.HorizontalAlign.CENTER;
          _label.verticalAlign = Label.VerticalAlign.CENTER;
          _label.lineHeight = 0;
          _label.overflow = Overflow.NONE;
          _label.enableWrapText = false;

          // 添加节点
          this.badgeNode.addChild(backgroundNode);
          this.badgeNode.addChild(this.labelNode);
          this.setPosition(this.position);
          return this.badgeNode;
        }
        start() {}
      }, _class3.POSITION = void 0, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bg", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "string", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '6';
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "width", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "height", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 26;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "radius", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "position", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return Position.TOP_LEFT;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BehaviorTree.ts", ['cc', './BTreeNode.ts'], function (exports) {
  var cclegacy, BTreeNode;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BTreeNode = module.BTreeNode;
    }],
    execute: function () {
      cclegacy._RF.push({}, "22a91RP3fNG/rWWAXlmM4BT", "BehaviorTree", undefined);
      var countUnnamed = 0;

      /** 行为树 */
      class BehaviorTree {
        /** 是否已开始执行 */
        get started() {
          return this._started;
        }

        /**
         * 构造函数
         * @param node          根节点
         * @param blackboard    外部参数对象
         */
        constructor(node, blackboard) {
          this.title = void 0;
          /** 根节点 */
          this._root = void 0;
          /** 当前执行节点 */
          this._current = void 0;
          /** 是否已开始执行 */
          this._started = false;
          /** 外部参数对象 */
          this._blackboard = void 0;
          countUnnamed += 1;
          this.title = node.constructor.name + '(btree_' + countUnnamed + ')';
          this._root = node;
          this._blackboard = blackboard;
        }

        /** 设置行为逻辑中的共享数据 */
        setObject(blackboard) {
          this._blackboard = blackboard;
        }

        /** 执行行为树逻辑 */
        run() {
          if (this._started) {
            console.error(`行为树【${this.title}】未调用步骤，在最后一次调用步骤时有一个任务未完成`);
          }
          this._started = true;
          var node = BehaviorTree.getNode(this._root);
          this._current = node;
          node.setControl(this);
          node.start(this._blackboard);
          node.run(this._blackboard);
        }
        running(node) {
          this._started = false;
        }
        success() {
          this._current.end(this._blackboard);
          this._started = false;
        }
        fail() {
          this._current.end(this._blackboard);
          this._started = false;
        }

        /** ---------------------------------------------------------------------------------------------------- */

        static register(name, node) {
          this._registeredNodes.set(name, node);
        }
        static getNode(name) {
          var node = name instanceof BTreeNode ? name : this._registeredNodes.get(name);
          if (!node) {
            throw new Error(`无法找到节点【${name}】，可能它没有注册过`);
          }
          return node;
        }
      }
      exports('BehaviorTree', BehaviorTree);
      BehaviorTree._registeredNodes = new Map();
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BhvButtonGroup.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Enum, Button, SpriteFrame, EventHandler, _decorator, Component, color;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Enum = module.Enum;
      Button = module.Button;
      SpriteFrame = module.SpriteFrame;
      EventHandler = module.EventHandler;
      _decorator = module._decorator;
      Component = module.Component;
      color = module.color;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14;
      cclegacy._RF.push({}, "41df676L55LvJ52uxkQpfxJ", "BhvButtonGroup", undefined);
      const {
        ccclass,
        property,
        menu
      } = _decorator;
      var PARAM_TYPE = /*#__PURE__*/function (PARAM_TYPE) {
        PARAM_TYPE[PARAM_TYPE["CHILDREN_INDEX"] = 0] = "CHILDREN_INDEX";
        PARAM_TYPE[PARAM_TYPE["CHILDREN_NAME"] = 1] = "CHILDREN_NAME";
        return PARAM_TYPE;
      }(PARAM_TYPE || {});
      /**
       * 群体事件，适合绑定节点组的回调信息
       * 将该组件的所处节点的所有子节点，绑定相同的回调对象，并将组件名设置到customEventData属性中
       */
      let BhvButtonGroup = exports('BhvButtonGroup', (_dec = menu("添加特殊行为/UI/Button Group(一组按钮控制)"), _dec2 = property({
        type: Enum(Button.Transition)
      }), _dec3 = property({
        visible: function () {
          // @ts-ignore
          return this.transition === Button.Transition.COLOR;
        }
      }), _dec4 = property({
        visible: function () {
          // @ts-ignore
          return this.transition === Button.Transition.COLOR;
        }
      }), _dec5 = property({
        visible: function () {
          // @ts-ignore
          return this.transition === Button.Transition.COLOR;
        }
      }), _dec6 = property({
        visible: function () {
          // @ts-ignore
          return this.transition === Button.Transition.COLOR;
        }
      }), _dec7 = property({
        type: SpriteFrame,
        visible: function () {
          // @ts-ignore
          return this.transition === Button.Transition.SPRITE;
        }
      }), _dec8 = property({
        type: SpriteFrame,
        visible: function () {
          // @ts-ignore
          return this.transition === Button.Transition.SPRITE;
        }
      }), _dec9 = property({
        type: SpriteFrame,
        visible: function () {
          // @ts-ignore
          return this.transition === Button.Transition.SPRITE;
        }
      }), _dec10 = property({
        type: SpriteFrame,
        visible: function () {
          // @ts-ignore
          return this.transition === Button.Transition.SPRITE;
        }
      }), _dec11 = property({
        visible: function () {
          // @ts-ignore
          return this.transition === Button.Transition.SCALE || this.transition === Button.Transition.COLOR;
        }
      }), _dec12 = property({
        visible: function () {
          // @ts-ignore
          return this.transition === Button.Transition.SCALE;
        }
      }), _dec13 = property({
        type: Enum(PARAM_TYPE)
      }), _dec14 = property({
        type: [EventHandler]
      }), _dec15 = property({
        tooltip: '规避3.x引擎BUG，EventHandler.component位为空导致找不到触发事件的脚本名的问题',
        readonly: true
      }), ccclass(_class = _dec(_class = (_class2 = class BhvButtonGroup extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "transition", _descriptor, this);
          _initializerDefineProperty(this, "hoverColor", _descriptor2, this);
          _initializerDefineProperty(this, "normalColor", _descriptor3, this);
          _initializerDefineProperty(this, "pressedColor", _descriptor4, this);
          _initializerDefineProperty(this, "disabledColor", _descriptor5, this);
          _initializerDefineProperty(this, "normalSprite", _descriptor6, this);
          _initializerDefineProperty(this, "pressedSprite", _descriptor7, this);
          _initializerDefineProperty(this, "hoverSprite", _descriptor8, this);
          _initializerDefineProperty(this, "disabledSprite", _descriptor9, this);
          _initializerDefineProperty(this, "duration", _descriptor10, this);
          _initializerDefineProperty(this, "zoomScale", _descriptor11, this);
          _initializerDefineProperty(this, "paramType", _descriptor12, this);
          _initializerDefineProperty(this, "touchEvents", _descriptor13, this);
          _initializerDefineProperty(this, "EventHandler_component", _descriptor14, this);
        }
        onLoad() {
          this.node.children.forEach((node, nodeIndex) => {
            let comp = node.getComponent(Button);
            if (comp == null) comp = node.addComponent(Button);

            // 同步属性

            // comp.target = node;
            // comp.transition = this.transition;
            // comp.zoomScale = this.zoomScale;

            // comp.disabledSprite = this.disabledSprite;
            // comp.hoverSprite = this.hoverSprite;
            // comp.normalSprite = this.normalSprite;
            // comp.pressedSprite = this.pressedSprite;

            // comp.hoverColor = this.hoverColor;
            // comp.normalColor = this.normalColor;
            // comp.pressedColor = this.pressedColor;
            // comp.disabledColor = this.disabledColor;

            // 绑定回调事件
            this.touchEvents.forEach(event => {
              // 克隆数据，每个节点获取的都是不同的回调
              let hd = new EventHandler(); //copy对象
              hd.component = event.component == "" ? this.EventHandler_component : event.component;
              hd.handler = event.handler;
              hd.target = event.target;
              if (this.paramType === PARAM_TYPE.CHILDREN_INDEX) {
                hd.customEventData = nodeIndex.toString();
              } else {
                hd.customEventData = node.name;
              }
              comp.clickEvents.push(hd);
            });
          });
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "transition", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return Button.Transition.NONE;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "hoverColor", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return color(255, 255, 255);
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "normalColor", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return color(214, 214, 214);
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "pressedColor", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return color(211, 211, 211);
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "disabledColor", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return color(124, 124, 124);
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "normalSprite", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "pressedSprite", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "hoverSprite", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "disabledSprite", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "duration", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "zoomScale", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.1;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "paramType", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return PARAM_TYPE.CHILDREN_INDEX;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "touchEvents", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "EventHandler_component", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "VMModify";
        }
      })), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BhvFrameIndex.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Sprite, SpriteFrame, CCInteger, _decorator, Component, error;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      SpriteFrame = module.SpriteFrame;
      CCInteger = module.CCInteger;
      _decorator = module._decorator;
      Component = module.Component;
      error = module.error;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "c238ewfJ2VJnZ8Gb8YQs5Ts", "BhvFrameIndex", undefined);
      const {
        ccclass,
        property,
        executeInEditMode,
        requireComponent,
        menu
      } = _decorator;
      let BhvFrameIndex = exports('BhvFrameIndex', (_dec = requireComponent(Sprite), _dec2 = menu("添加特殊行为/UI/Frame Index(帧图改变)"), _dec3 = property({
        type: [SpriteFrame],
        tooltip: 'sprite将会用到帧图片'
      }), _dec4 = property({
        type: CCInteger,
        tooltip: '当前显示的帧图'
      }), ccclass(_class = executeInEditMode(_class = _dec(_class = _dec2(_class = (_class2 = class BhvFrameIndex extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "spriteFrames", _descriptor, this);
          _initializerDefineProperty(this, "_index", _descriptor2, this);
        }
        get index() {
          return this._index;
        }
        set index(value) {
          if (value < 0) return;
          this._index = value % this.spriteFrames.length;
          let sprite = this.node.getComponent(Sprite);
          //设置 Sprite 组件的spriteFrame属性，变换图片               
          sprite.spriteFrame = this.spriteFrames[this._index];
        }
        /** 通过设置帧名字来设置对象 */
        setName(name) {
          let index = this.spriteFrames.findIndex(v => {
            return v.name == name;
          });
          if (index < 0) {
            error('frameIndex 设置了不存在的name:', name);
          }
          this.index = index || 0;
        }

        /** 随机范围设置帧图片 */
        random(min, max) {
          if (!this.spriteFrames) return;
          let frameMax = this.spriteFrames.length;
          if (min == null || min < 0) min = 0;
          if (max == null || max > frameMax) max = frameMax;
          this.index = Math.floor(Math.random() * (max - min) + min);
        }
        next() {
          this.index++;
        }
        previous() {
          this.index--;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spriteFrames", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [null];
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "index", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "index"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_index", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      })), _class2)) || _class) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BhvRollNumber.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Enum, _decorator, Component, lerp;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Enum = module.Enum;
      _decorator = module._decorator;
      Component = module.Component;
      lerp = module.lerp;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
      cclegacy._RF.push({}, "72d13dwmG9LS4gkJhSuAp3F", "BhvRollNumber", undefined);
      const {
        ccclass,
        property,
        menu
      } = _decorator;
      var VALUE_TYPE = /*#__PURE__*/function (VALUE_TYPE) {
        VALUE_TYPE[VALUE_TYPE["INTEGER"] = 0] = "INTEGER";
        VALUE_TYPE[VALUE_TYPE["FIXED_2"] = 1] = "FIXED_2";
        VALUE_TYPE[VALUE_TYPE["TIMER"] = 2] = "TIMER";
        VALUE_TYPE[VALUE_TYPE["PERCENTAGE"] = 3] = "PERCENTAGE";
        VALUE_TYPE[VALUE_TYPE["KMBT_FIXED2"] = 4] = "KMBT_FIXED2";
        VALUE_TYPE[VALUE_TYPE["CUSTOMER"] = 5] = "CUSTOMER";
        return VALUE_TYPE;
      }(VALUE_TYPE || {});
      /**
       * [滚动数字] ver 0.5.0
       * 将会使用 lerp 自动滚动数字到目标数值
       */
      let BhvRollNumber = exports('BhvRollNumber', (_dec = menu("添加特殊行为/UI/Roll Number (滚动数字)"), _dec2 = property({
        type: Label,
        tooltip: '需要滚动的 Label 组件,如果不进行设置，就会从自己的节点自动查找'
      }), _dec3 = property({
        tooltip: '当前的滚动值(开始的滚动值)'
      }), _dec4 = property({
        tooltip: '是否显示正负符号'
      }), _dec5 = property({
        tooltip: '滚动的目标值'
      }), _dec6 = property({
        tooltip: '滚动的线性差值',
        step: 0.01,
        max: 1,
        min: 0
      }), _dec7 = property({
        tooltip: '是否在开始时就播放'
      }), _dec8 = property({
        tooltip: '在滚动之前会等待几秒',
        step: 0.1,
        max: 1,
        min: 0
      }), _dec9 = property({
        type: Enum(VALUE_TYPE),
        tooltip: '是否在开始时就播放'
      }), ccclass(_class = _dec(_class = (_class2 = class BhvRollNumber extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "label", _descriptor, this);
          _initializerDefineProperty(this, "value", _descriptor2, this);
          _initializerDefineProperty(this, "showPlusSymbol", _descriptor3, this);
          _initializerDefineProperty(this, "_targetValue", _descriptor4, this);
          /** 滚动的线性差值 0 ~ 1 */
          _initializerDefineProperty(this, "lerp", _descriptor5, this);
          _initializerDefineProperty(this, "playAtStart", _descriptor6, this);
          _initializerDefineProperty(this, "runWaitTimer", _descriptor7, this);
          _initializerDefineProperty(this, "valueType", _descriptor8, this);
          /** 自定义string 处理函数 */
          this._custom_callback = null;
          this.isScrolling = false;
        }
        get targetValue() {
          return this._targetValue;
        }
        set targetValue(v) {
          this._targetValue = v;
          this.scroll(); //数据变动了就开始滚动
        }

        onLoad() {
          if (this.label == undefined) {
            this.label = this.node.getComponent(Label);
          }
          if (this.playAtStart) {
            this.updateLabel();
            this.scroll();
          }
        }

        /** 开始滚动数字 */
        scroll() {
          if (this.isScrolling) return; //  已经在滚动了就返回
          if (this.runWaitTimer > 0) {
            this.scheduleOnce(() => {
              this.isScrolling = true;
            }, this.runWaitTimer);
          } else {
            this.isScrolling = true;
          }
        }

        /** 停止滚动数字 */
        stop() {
          this.value = this.targetValue;
          this.isScrolling = false;
          this.updateLabel();
        }

        /** 初始化数值,不填写则全部按默认值处理 */
        init(value, target, lerp) {
          this.targetValue = target || 0;
          this.value = value || 0;
          this.lerp = lerp || 0.1;
        }

        /** 滚动到指定数字 */
        scrollTo(target) {
          if (target === null || target === undefined) return;
          this.targetValue = target;
        }

        /** 更新文本 */
        updateLabel() {
          let value = this.value;
          let string = '';
          switch (this.valueType) {
            case VALUE_TYPE.INTEGER:
              // 最终显示整数类型
              string = Math.round(value) + '';
              break;
            case VALUE_TYPE.FIXED_2:
              // 最终显示两位小数类型
              string = value.toFixed(2);
              break;
            case VALUE_TYPE.TIMER:
              // 最终显示 计时器类型
              string = parseTimer(value);
              break;
            case VALUE_TYPE.PERCENTAGE:
              // 最终显示 百分比
              string = Math.round(value * 100) + '%';
              break;
            case VALUE_TYPE.KMBT_FIXED2:
              // 长单位缩放,只计算到 KMBT
              if (value >= Number.MAX_VALUE) {
                string = 'MAX';
              } else if (value > 1000000000000) {
                string = (value / 1000000000000).toFixed(2) + 'T';
              } else if (value > 1000000000) {
                string = (value / 1000000000).toFixed(2) + 'B';
              } else if (value > 1000000) {
                string = (value / 1000000).toFixed(2) + 'M';
              } else if (value > 1000) {
                string = (value / 1000).toFixed(2) + "K";
              } else {
                string = Math.round(value).toString();
              }
              break;
            case VALUE_TYPE.CUSTOMER:
              // 自定义设置模式 (通过给定的自定义函数..处理)
              if (this._custom_callback) {
                string = this._custom_callback(this.value, this.targetValue);
              }
              break;
          }

          // 显示正负符号

          if (this.showPlusSymbol) {
            if (value > 0) {
              string = '+' + string;
            } else if (value < 0) {
              string = '-' + string;
            }
          }
          if (this.label) {
            if (string === this.label.string) return; // 保证效率,如果上次赋值过,就不重复赋值
            this.label.string = string;
          }
        }
        update(dt) {
          if (this.isScrolling == false) return;
          this.value = lerp(this.value, this.targetValue, this.lerp);
          this.updateLabel();
          if (Math.abs(this.value - this.targetValue) <= 0.0001) {
            this.value = this.targetValue;
            this.isScrolling = false;
            //this.node.emit('roll-hit-target');        // 滚动数字击中了目标
            return;
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "value", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "showPlusSymbol", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "targetValue", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "targetValue"), _class2.prototype), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_targetValue", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "lerp", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "playAtStart", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "runWaitTimer", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "valueType", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return VALUE_TYPE.INTEGER;
        }
      })), _class2)) || _class) || _class));

      /** 时间格式转换 */
      function parseTimer(timer = 0, isFullTimer = true) {
        let t = Math.floor(timer);
        let hours = Math.floor(t / 3600);
        let mins = Math.floor(t % 3600 / 60);
        let secs = t % 60;
        let m = '' + mins;
        let s = '' + secs;
        if (secs < 10) s = '0' + secs;

        // full timer 按小时算,无论有没有小时
        if (isFullTimer) {
          if (mins < 10) m = '0' + mins;
          return hours + ':' + m + ':' + s;
        } else {
          m = '' + (mins + hours * 60);
          if (mins < 10) m = '0' + mins;
          return m + ':' + s;
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BhvSwitchPage.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './VMEnv.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, CCInteger, _decorator, Component, VMEnv;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      CCInteger = module.CCInteger;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      VMEnv = module.VMEnv;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "b3d083kncpDPqVztMtiq6DO", "BhvSwitchPage", undefined);
      const {
        ccclass,
        property,
        executeInEditMode,
        menu
      } = _decorator;
      let BhvSwitchPage = exports('BhvSwitchPage', (_dec = menu("添加特殊行为/UI/Switch Page (切换页面)"), _dec2 = property({
        type: CCInteger
      }), ccclass(_class = executeInEditMode(_class = _dec(_class = (_class2 = class BhvSwitchPage extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "isLoopPage", _descriptor, this);
          _initializerDefineProperty(this, "_index", _descriptor2, this);
          this.preIndex = 0;
          //判断是否在 changing 页面状态
          this._isChanging = false;
        }
        get index() {
          return this._index;
        }
        set index(v) {
          if (this.isChanging) return;
          v = Math.round(v);
          let count = this.node.children.length - 1;
          if (this.isLoopPage) {
            if (v > count) v = 0;
            if (v < 0) v = count;
          } else {
            if (v > count) v = count;
            if (v < 0) v = 0;
          }
          this.preIndex = this._index; //标记之前的页面
          this._index = v;
          if (VMEnv.editor) {
            this._updateEditorPage(v);
          } else {
            this._updatePage(v);
          }
        }
        /**只读，是否在changing 的状态 */
        get isChanging() {
          return this._isChanging;
        }
        onLoad() {
          this.preIndex = this.index;
        }
        _updateEditorPage(page) {
          if (!VMEnv.editor) return;
          let children = this.node.children;
          for (let i = 0; i < children.length; i++) {
            const node = children[i];
            if (i == page) {
              node.active = true;
            } else {
              node.active = false;
            }
          }
        }
        _updatePage(page) {
          let children = this.node.children;
          let preIndex = this.preIndex;
          let curIndex = this.index;
          if (preIndex === curIndex) return; //没有改变就不进行操作

          let preNode = children[preIndex]; //旧节点
          let showNode = children[curIndex]; //新节点

          preNode.active = false;
          showNode.active = true;
        }
        next() {
          if (this.isChanging) {
            return false;
          } else {
            this.index++;
            return true;
          }
        }
        previous() {
          if (this.isChanging) {
            return false;
          } else {
            this.index--;
            return true;
          }
        }
        setEventIndex(e, index) {
          if (this.index >= 0 && this.index != null && this.isChanging === false) {
            this.index = index;
            return true;
          } else {
            return false;
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "isLoopPage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_index", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "index"), _class2.prototype)), _class2)) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BranchNode.ts", ['cc', './BehaviorTree.ts', './BTreeNode.ts'], function (exports) {
  var cclegacy, BehaviorTree, BTreeNode;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BehaviorTree = module.BehaviorTree;
    }, function (module) {
      BTreeNode = module.BTreeNode;
    }],
    execute: function () {
      cclegacy._RF.push({}, "beafaDMsw9FCbGDpLVmMfa1", "BranchNode", undefined);

      /** 复合节点 */
      class BranchNode extends BTreeNode {
        constructor(nodes) {
          super();
          /** 子节点数组 */
          this.children = void 0;
          /** 当前任务索引 */
          this._actualTask = void 0;
          /** 正在运行的节点 */
          this._runningNode = void 0;
          this._nodeRunning = void 0;
          /** 外部参数对象 */
          this._blackboard = void 0;
          this.children = nodes || [];
        }
        start() {
          this._actualTask = 0;
          super.start();
        }
        run(blackboard) {
          if (this.children.length == 0) {
            // 没有子任务直接视为执行失败
            this._control.fail();
          } else {
            this._blackboard = blackboard;
            this.start();
            if (this._actualTask < this.children.length) {
              this._run();
            }
          }
          this.end();
        }

        /** 执行当前节点逻辑 */
        _run(blackboard) {
          var node = BehaviorTree.getNode(this.children[this._actualTask]);
          this._runningNode = node;
          node.setControl(this);
          node.start(this._blackboard);
          node.run(this._blackboard);
        }
        running(node) {
          this._nodeRunning = node;
          this._control.running(node);
        }
        success() {
          this._nodeRunning = null;
          this._runningNode.end(this._blackboard);
        }
        fail() {
          this._nodeRunning = null;
          this._runningNode.end(this._blackboard);
        }
      }
      exports('BranchNode', BranchNode);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BTreeNode.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f0aeepAwndJP7wlpP6QKx06", "BTreeNode", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-06-21 12:05:14
       * @LastEditors: dgflash
       * @LastEditTime: 2022-07-20 14:04:44
       */
      /** 行为树节点 */
      class BTreeNode {
        constructor() {
          this._control = void 0;
          this.title = void 0;
          this.title = this.constructor.name;
        }
        start(blackboard) {}
        end(blackboard) {}
        setControl(control) {
          this._control = control;
        }
        running(blackboard) {
          this._control.running(this);
        }
        success() {
          this._control.success();
        }
        fail() {
          this._control.fail();
        }
      }
      exports('BTreeNode', BTreeNode);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BuildTimeConstants.ts", ['cc', './env'], function (exports) {
  var cclegacy, env;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      env = module;
    }],
    execute: function () {
      cclegacy._RF.push({}, "21a39/4HchJdJkSQKKKkLh9", "BuildTimeConstants", undefined);
      const keys = Object.keys(env).sort();

      /* 游戏运行环境 */
      class BuildTimeConstants {
        constructor() {
          const keyNameMaxLen = keys.reduce((len, key) => Math.max(len, key.length), 0);
          var enviroment = `${keys.map(key => {
            const value = env[key];
            const valueRep = typeof value === 'boolean' ? value ? 'true' : 'false' : value;
            return `\n${key.padStart(keyNameMaxLen, ' ')} : ${valueRep}`;
          })}`;
          console.log(enviroment);
        }
      }
      exports('BuildTimeConstants', BuildTimeConstants);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BundleConfig.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a9ca4J216NEwZ2llb+PneNc", "BundleConfig", undefined);
      class BundleConfig {
        constructor() {
          // start >>>>>>
          this.BundleName = {
            game: {
              prefab: {
                "game1": 'prefab/game1',
                "game2": 'prefab/game2'
              },
              sound: {
                "music1": 'sound/music1',
                "music2": 'sound/music2'
              },
              texture: {
                "game1": 'texture/game1',
                "game2": 'texture/game2'
              }
            },
            home: {
              prefab: {
                "home1": 'prefab/home1',
                "home2": 'prefab/home2'
              },
              sound: {
                "music1": 'sound/music1',
                "music2": 'sound/music2'
              },
              texture: {
                "home1": 'texture/home1',
                "home2": 'texture/home2'
              }
            }
          };
        }
        static get instance() {
          return BundleConfig._instance ? BundleConfig._instance : BundleConfig._instance = new BundleConfig();
        } // end >>>>>>
      }
      exports('default', BundleConfig);
      BundleConfig._instance = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BundleManager.ts", ['cc', './Oops.ts', './BundleConfig.ts'], function (exports) {
  var cclegacy, Font, JsonAsset, SpriteFrame, Sprite, Texture2D, ImageAsset, AudioClip, Material, Prefab, oops, BundleConfig;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Font = module.Font;
      JsonAsset = module.JsonAsset;
      SpriteFrame = module.SpriteFrame;
      Sprite = module.Sprite;
      Texture2D = module.Texture2D;
      ImageAsset = module.ImageAsset;
      AudioClip = module.AudioClip;
      Material = module.Material;
      Prefab = module.Prefab;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      BundleConfig = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d46905zQENHvJohGZ5N1hzW", "BundleManager", undefined);
      /** 资源模块化工具 */
      class BundleManager {
        /**
         * 根据资源类型获得对应文件
         * @param assetType 资源类型
         */
        static getAssetUrl(assetType) {
          let typeUrl = "";
          switch (assetType) {
            case Prefab:
              typeUrl = "prefab";
              break;
            case Material:
              typeUrl = "shader";
              break;
            case AudioClip:
              typeUrl = "sound";
              break;
            case ImageAsset:
            case Texture2D:
            case Sprite:
            case SpriteFrame:
              typeUrl = "texture";
              break;
            case JsonAsset:
              typeUrl = "data";
              break;
            case Font:
              typeUrl = "font";
              break;
            default:
              console.error("没有该资源类型", assetType);
              break;
          }
          return typeUrl;
        }

        /**
         * 加载指定类型资源
         * @param bundleName 外部资源包名
         * @param assetName  目标加载资源名
         */
        static loadAsset(bundleName, assetName, assetType) {
          let str = this.getAssetUrl(assetType);
          // @ts-ignore
          let url = BundleConfig.instance.BundleName[bundleName][str][assetName];
          // 兼容3.x ,加载 SpriteFrame 路径需要添加后缀
          if (assetType === SpriteFrame) {
            url += "/spriteFrame";
          } else if (assetType === Texture2D) {
            url += "/texture";
          }
          return new Promise(async (resolve, reject) => {
            // @ts-ignore
            oops.res.load(bundleName, url, (err, res) => {
              if (!err) {
                // 加载成功
                resolve(res);
              } else {
                //加载失败
                reject(err);
                console.error(`外部资源包${bundleName}，路径${url},加载失败`, err);
              }
            });
          });
        }

        /**
         * 加载预制体
         * @param bundleName ab包名（模块名）
         * @param assetName 资源名
         */
        static loadPrefab(bundleName, assetName) {
          return this.loadAsset(bundleName, assetName, Prefab);
        }

        /**
         * 加载音频
         * @param bundleName ab包名（模块名）
         * @param assetName 资源名
         */
        static loadAudio(bundleName, assetName) {
          return this.loadAsset(bundleName, assetName, AudioClip);
        }

        /**
         * 加载图片
         * @param bundleName ab包名（模块名）
         * @param assetName 资源名
         */
        static loadTextre(bundleName, assetName) {
          return this.loadAsset(bundleName, assetName, SpriteFrame);
        }

        /**
         * 通过资源相对路径释放资源
         * @param bundleName     ab包名（模块名）
         * @param assetName      资源名
         */
        static release(bundleName, assetName, assetType) {
          let str = this.getAssetUrl(assetType);
          // @ts-ignore
          let url = BundleConfig.BundleName[bundleName][str][assetName];
          // 兼容3.x ,加载 SpriteFrame 路径需要添加后缀
          if (assetType === SpriteFrame) {
            url += "/spriteFrame";
          } else if (assetType === Texture2D) {
            url += "/texture";
          }
          oops.res.release(url, bundleName);
        }
      }
      exports('BundleManager', BundleManager);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ButtonEffect.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Oops.ts', './ButtonSimple.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Sprite, Animation, AnimationClip, oops, ButtonSimple;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Animation = module.Animation;
      AnimationClip = module.AnimationClip;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      ButtonSimple = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "1be36hrGO5Oz6Eapg6ygW03", "ButtonEffect", undefined);
      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let ButtonEffect = exports('default', (_dec = ccclass("ButtonEffect"), _dec2 = menu('ui/button/ButtonEffect'), _dec3 = property({
        tooltip: "是否开启"
      }), _dec(_class = _dec2(_class = (_class2 = class ButtonEffect extends ButtonSimple {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "disabledEffect", _descriptor, this);
          this.anim = void 0;
        }
        /** 按钮禁用效果 */
        get grayscale() {
          return this.node.getComponent(Sprite).grayscale;
        }
        set grayscale(value) {
          if (this.node.getComponent(Sprite)) {
            this.node.getComponent(Sprite).grayscale = value;
          }
        }
        onLoad() {
          this.anim = this.node.addComponent(Animation);
          var ac_start = oops.res.get("common/anim/button_scale_start", AnimationClip);
          var ac_end = oops.res.get("common/anim/button_scale_end", AnimationClip);
          this.anim.defaultClip = ac_start;
          this.anim.createState(ac_start, ac_start == null ? void 0 : ac_start.name);
          this.anim.createState(ac_end, ac_end == null ? void 0 : ac_end.name);
          super.onLoad();
        }
        onTouchtStart(event) {
          if (!this.disabledEffect) {
            this.anim.play("button_scale_start");
          }
        }
        onTouchEnd(event) {
          if (!this.disabledEffect) {
            this.anim.play("button_scale_end");
          }
          super.onTouchEnd(event);
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "disabledEffect", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ButtonSimple.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Component, Node, game;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Node = module.Node;
      game = module.game;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "8d645yObX1FvJfk2sbi0rxp", "ButtonSimple", undefined);
      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let ButtonSimple = exports('default', (_dec = ccclass("ButtonSimple"), _dec2 = menu('ui/button/ButtonSimple'), _dec3 = property({
        tooltip: "是否只能触发一次"
      }), _dec4 = property({
        tooltip: "每次触发间隔"
      }), _dec(_class = _dec2(_class = (_class2 = class ButtonSimple extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "once", _descriptor, this);
          _initializerDefineProperty(this, "interval", _descriptor2, this);
          this.touchCount = 0;
          this.touchtEndTime = 0;
        }
        onLoad() {
          this.node.on(Node.EventType.TOUCH_START, this.onTouchtStart, this);
          this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        /** 触摸开始 */
        onTouchtStart(event) {}

        /** 触摸结束 */
        onTouchEnd(event) {
          if (this.once) {
            if (this.touchCount > 0) {
              event.propagationStopped = true;
              return;
            }
            this.touchCount++;
          }

          // 防连点500毫秒出发一次事件
          if (this.touchtEndTime && game.totalTime - this.touchtEndTime < this.interval) {
            event.propagationStopped = true;
          } else {
            this.touchtEndTime = game.totalTime;
          }
        }
        onDestroy() {
          this.node.off(Node.EventType.TOUCH_START, this.onTouchtStart, this);
          this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "once", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "interval", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 500;
        }
      })), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ButtonTouchLong.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ButtonEffect.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, EventHandler, _decorator, ButtonEffect;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      EventHandler = module.EventHandler;
      _decorator = module._decorator;
    }, function (module) {
      ButtonEffect = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "da96en7WYpPTaPIkO1l/Nux", "ButtonTouchLong", undefined);
      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let ButtonTouchLong = exports('ButtonTouchLong', (_dec = ccclass("ButtonTouchLong"), _dec2 = menu('ui/button/ButtonTouchLong'), _dec3 = property({
        tooltip: "长按时间（秒）"
      }), _dec4 = property({
        type: [EventHandler],
        tooltip: "长按时间（秒）"
      }), _dec(_class = _dec2(_class = (_class2 = class ButtonTouchLong extends ButtonEffect {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "time", _descriptor, this);
          _initializerDefineProperty(this, "clickEvents", _descriptor2, this);
          this._passTime = 0;
          this._isTouchLong = true;
          this._event = null;
        }
        onLoad() {
          this._isTouchLong = false;
          super.onLoad();
        }

        /** 触摸开始 */
        onTouchtStart(event) {
          this._event = event;
          this._passTime = 0;
          super.onTouchtStart(event);
        }

        /** 触摸结束 */
        onTouchEnd(event) {
          if (this._passTime > this.time) {
            event.propagationStopped = true;
          }
          this._event = null;
          this._passTime = 0;
          this._isTouchLong = false;
          super.onTouchEnd(event);
        }
        removeTouchLong() {
          this._event = null;
          this._isTouchLong = false;
        }

        /** 引擎更新事件 */
        update(dt) {
          if (this._event && !this._isTouchLong) {
            this._passTime += dt;
            if (this._passTime >= this.time) {
              this._isTouchLong = true;
              this.clickEvents.forEach(event => {
                event.emit([event.customEventData]);
              });
              this.removeTouchLong();
            }
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "time", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "clickEvents", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CameraUtil.ts", ['cc'], function (exports) {
  var cclegacy, Vec3, view;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      view = module.view;
    }],
    execute: function () {
      cclegacy._RF.push({}, "95c77QQpp1EjKj8UBFCCdKu", "CameraUtil", undefined);

      /** 摄像机工具 */
      class CameraUtil {
        /**
         * 当前世界坐标是否在摄像机显示范围内
         * @param camera    摄像机
         * @param worldPos  坐标
         */
        static isInView(camera, worldPos) {
          var cameraPos = camera.node.getWorldPosition();
          var viewPos = camera.worldToScreen(worldPos);
          var dir = Vec3.normalize(new Vec3(), worldPos.subtract(cameraPos));
          var forward = camera.node.forward;
          var dot = Vec3.dot(forward, dir);
          const viewportRect = view.getViewportRect();

          // 判断物体是否在相机前面
          if (dot > 0
          // 判断物体是否在视窗内
          && viewPos.x <= viewportRect.width && viewPos.x >= 0 && viewPos.y <= viewportRect.height && viewPos.y >= 0) return true;else return false;
        }
      }
      exports('CameraUtil', CameraUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CCComp.ts", ['cc', './GameComponent.ts'], function (exports) {
  var cclegacy, _decorator, GameComponent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      GameComponent = module.GameComponent;
    }],
    execute: function () {
      var _dec, _class, _class2;
      cclegacy._RF.push({}, "dd207fiyGJLf5r+bkiMgwdt", "CCComp", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 
       * 游戏显示对象组件
       * 
       * 功能介绍：
       * 1. 对象拥有 cc.Component 组件功能与 ecs.Comp 组件功能
       * 2. 对象自带全局事件监听、释放、发送全局消息功能
       * 3. 对象管理的所有节点摊平，直接通过节点名获取cc.Node对象
       * 
       * 应用场景
       * 1. 网络游戏，优先有数据对象，然后创建视图对象，当释放视图组件时，部分场景不希望释放数据对象
       * 
       * @example
      @ccclass('RoleViewComp')
      @ecs.register('RoleView', false)
      export class RoleViewComp extends CCComp {
          @property({ type: sp.Skeleton, tooltip: '角色动画' })
          spine: sp.Skeleton = null!;
            onLoad(){
              
          }
      }
       */
      let CCComp = exports('CCComp', (_dec = ccclass('CCComp'), _dec(_class = (_class2 = class CCComp extends GameComponent {
        constructor(...args) {
          super(...args);
          this.canRecycle = void 0;
          this.ent = void 0;
        }
      }, _class2.tid = -1, _class2.compName = void 0, _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CCVMParentComp.ts", ['cc', './VMParent.ts'], function (exports) {
  var cclegacy, _decorator, VMParent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      VMParent = module.default;
    }],
    execute: function () {
      var _dec, _class, _class2;
      cclegacy._RF.push({}, "5908aTmM1lItpXgo7ROpQeQ", "CCVMParentComp", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 
       * 支持 MVVM 功能的游戏显示对象组件
       * 
       * 使用方法：
       * 1. 对象拥有 cc.Component 组件功能与 ecs.Comp 组件功能
       * 2. 对象自带全局事件监听、释放、发送全局消息功能
       * 3. 对象管理的所有节点摊平，直接通过节点名获取cc.Node对象（节点名不能有重名）
       * 4. 对象支持 VMParent 所有功能
       * 
       * 应用场景
       * 1. 网络游戏，优先有数据对象，然后创建视图对象，当释放视图组件时，部分场景不希望释放数据对象
       * 
       * @example
      @ccclass('LoadingViewComp')
      @ecs.register('LoadingView', false)
      export class LoadingViewComp extends CCVMParentComp {
          // VM 组件绑定数据
          data: any = {
              // 加载资源当前进度
              finished: 0,
              // 加载资源最大进度
              total: 0,
              // 加载资源进度比例值
              progress: "0",
              // 加载流程中提示文本
              prompt: ""
          };
            private progress: number = 0;
            reset(): void {
            
          }
      }
       */
      let CCVMParentComp = exports('CCVMParentComp', (_dec = ccclass('CCVMParentComp'), _dec(_class = (_class2 = class CCVMParentComp extends VMParent {
        constructor(...args) {
          super(...args);
          this.canRecycle = void 0;
          this.ent = void 0;
        }
      }, _class2.tid = -1, _class2.compName = void 0, _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Collection.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1dcf5AtQQVK3KQ/2jHHD5gi", "Collection", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-07-22 15:54:51
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-22 14:47:59
       */

      /** 支持Map与Array功能的集合对象 */
      class Collection extends Map {
        constructor(...args) {
          super(...args);
          this._array = [];
        }
        /** 获取数组对象 */
        get array() {
          return this._array;
        }

        /**
         * 设置值
         * @param key       关键字
         * @param value     数据值
         */
        set(key, value) {
          if (this.has(key)) {
            var old = this.get(key);
            var index = this._array.indexOf(old);
            this._array[index] = value;
          } else {
            this._array.push(value);
          }
          return super.set(key, value);
        }

        /**
         * 删除值
         * @param key       关键字
         */
        delete(key) {
          var value = this.get(key);
          if (value) {
            var index = this._array.indexOf(value);
            if (index > -1) this._array.splice(index, 1);
            return super.delete(key);
          }
          return false;
        }
        clear() {
          this._array.splice(0, this._array.length);
          super.clear();
        }
      }
      exports('Collection', Collection);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CommonPrompt.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './LanguageLabel.ts', './Oops.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Component, LanguageLabel, oops;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      LanguageLabel = module.LanguageLabel;
    }, function (module) {
      oops = module.oops;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "653bf8VPC5Fn49zFJFqXVgx", "CommonPrompt", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 公共提示窗口 */
      let CommonPrompt = exports('CommonPrompt', (_dec = ccclass("CommonPrompt"), _dec2 = property(LanguageLabel), _dec3 = property(LanguageLabel), _dec4 = property(LanguageLabel), _dec5 = property(LanguageLabel), _dec(_class = (_class2 = class CommonPrompt extends Component {
        constructor(...args) {
          super(...args);
          /** 窗口标题多语言组件 */
          _initializerDefineProperty(this, "lab_title", _descriptor, this);
          /** 提示内容多语言组件 */
          _initializerDefineProperty(this, "lab_content", _descriptor2, this);
          /** 确认按钮文本多语言组件 */
          _initializerDefineProperty(this, "lab_ok", _descriptor3, this);
          /** 取消按钮文本多语言组件 */
          _initializerDefineProperty(this, "lab_cancel", _descriptor4, this);
          this.config = {};
        }
        onTouchEnd(event, data) {
          switch (event.target.name) {
            case "btn_ok":
              this.onOk();
              break;
            case "btn_cancel":
              this.onCancel();
              break;
          }
        }

        /**
         * 
         * 
         * @param params 参数 
         * {
         *     title:      标题
         *     content:    内容
         *     okWord:     ok按钮上的文字
         *     okFunc:     确认时执行的方法
         *     cancelWord: 取消按钮的文字
         *     cancelFunc: 取消时执行的方法
         *     needCancel: 是否需要取消按钮
         * }
         */
        onAdded(params = {}) {
          this.config = params || {};
          this.setTitle();
          this.setContent();
          this.setBtnOkLabel();
          this.setBtnCancelLabel();
          this.node.active = true;
        }
        setTitle() {
          this.lab_title.dataID = this.config.title;
        }
        setContent() {
          this.lab_content.dataID = this.config.content;
        }
        setBtnOkLabel() {
          this.lab_ok.dataID = this.config.okWord;
        }
        setBtnCancelLabel() {
          if (this.lab_cancel) {
            this.lab_cancel.dataID = this.config.cancelWord;
            this.lab_cancel.node.parent.active = this.config.needCancel || false;
          }
        }
        onOk() {
          if (typeof this.config.okFunc == "function") {
            this.config.okFunc();
          }
          this.close();
        }
        onClose() {
          if (typeof this.config.closeFunc == "function") {
            this.config.closeFunc();
          }
          this.close();
        }
        onCancel() {
          if (typeof this.config.cancelFunc == "function") {
            this.config.cancelFunc();
          }
          this.close();
        }
        close() {
          oops.gui.removeByNode(this.node);
        }
        onDestroy() {
          this.config = null;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lab_title", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lab_content", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lab_ok", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lab_cancel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Config.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "5034dEezo5Frr6dhZGVgmTh", "Config", undefined);
      /*
       * @Author: dgflash
       * @Date: 2021-07-03 16:13:17
       * @LastEditors: dgflash
       * @LastEditTime: 2022-11-01 15:47:16
       */
      /** 游戏配置静态访问类 */
      class Config {
        constructor() {
          /** 环境常量 */
          // public btc!: BuildTimeConstants;
          /** 游戏配置数据，版本号、支持语种等数据 */
          this.game = void 0;
          /** 浏览器查询参数 */
          this.query = void 0;
        }
      }
      exports('Config', Config);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DateExt.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "80ebbBz8etB5qijWdYrU2HH", "DateExt", undefined);
      /** 格式化时间字符串 */
      Date.prototype.format = function (format) {
        const year = this.getFullYear();
        const month = this.getMonth() + 1;
        const day = this.getDate();
        const hours = this.getHours();
        const minutes = this.getMinutes();
        const seconds = this.getSeconds();
        return format.replace('yy', year.toString()).replace('mm', (month < 10 ? '0' : '') + month).replace('dd', (day < 10 ? '0' : '') + day).replace('hh', (hours < 10 ? '0' : '') + hours).replace('mm', (minutes < 10 ? '0' : '') + minutes).replace('ss', (seconds < 10 ? '0' : '') + seconds);
      };
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/debug-view-runtime-control.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component, Color, Canvas, UITransform, instantiate, Label, RichText, Toggle, Button, director;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      Color = module.Color;
      Canvas = module.Canvas;
      UITransform = module.UITransform;
      instantiate = module.instantiate;
      Label = module.Label;
      RichText = module.RichText;
      Toggle = module.Toggle;
      Button = module.Button;
      director = module.director;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "b2bd1+njXxJxaFY3ymm06WU", "debug-view-runtime-control", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let DebugViewRuntimeControl = exports('DebugViewRuntimeControl', (_dec = ccclass('internal.DebugViewRuntimeControl'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = class DebugViewRuntimeControl extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "compositeModeToggle", _descriptor, this);
          _initializerDefineProperty(this, "singleModeToggle", _descriptor2, this);
          _initializerDefineProperty(this, "EnableAllCompositeModeButton", _descriptor3, this);
          this._single = 0;
          this.strSingle = ['No Single Debug', 'Vertex Color', 'Vertex Normal', 'Vertex Tangent', 'World Position', 'Vertex Mirror', 'Face Side', 'UV0', 'UV1', 'UV Lightmap', 'Project Depth', 'Linear Depth', 'Fragment Normal', 'Fragment Tangent', 'Fragment Binormal', 'Base Color', 'Diffuse Color', 'Specular Color', 'Transparency', 'Metallic', 'Roughness', 'Specular Intensity', 'IOR', 'Direct Diffuse', 'Direct Specular', 'Direct All', 'Env Diffuse', 'Env Specular', 'Env All', 'Emissive', 'Light Map', 'Shadow', 'AO', 'Fresnel', 'Direct Transmit Diffuse', 'Direct Transmit Specular', 'Env Transmit Diffuse', 'Env Transmit Specular', 'Transmit All', 'Direct Internal Specular', 'Env Internal Specular', 'Internal All', 'Fog'];
          this.strComposite = ['Direct Diffuse', 'Direct Specular', 'Env Diffuse', 'Env Specular', 'Emissive', 'Light Map', 'Shadow', 'AO', 'Normal Map', 'Fog', 'Tone Mapping', 'Gamma Correction', 'Fresnel', 'Transmit Diffuse', 'Transmit Specular', 'Internal Specular', 'TT'];
          this.strMisc = ['CSM Layer Coloration', 'Lighting With Albedo'];
          this.compositeModeToggleList = [];
          this.singleModeToggleList = [];
          this.miscModeToggleList = [];
          this.textComponentList = [];
          this.labelComponentList = [];
          this.textContentList = [];
          this.hideButtonLabel = void 0;
          this._currentColorIndex = 0;
          this.strColor = ['<color=#ffffff>', '<color=#000000>', '<color=#ff0000>', '<color=#00ff00>', '<color=#0000ff>'];
          this.color = [Color.WHITE, Color.BLACK, Color.RED, Color.GREEN, Color.BLUE];
        }
        start() {
          // get canvas resolution
          const canvas = this.node.parent.getComponent(Canvas);
          if (!canvas) {
            console.error('debug-view-runtime-control should be child of Canvas');
            return;
          }
          const uiTransform = this.node.parent.getComponent(UITransform);
          const halfScreenWidth = uiTransform.width * 0.5;
          const halfScreenHeight = uiTransform.height * 0.5;
          let x = -halfScreenWidth + halfScreenWidth * 0.1,
            y = halfScreenHeight - halfScreenHeight * 0.1;
          const width = 200,
            height = 20;

          // new nodes
          const miscNode = this.node.getChildByName('MiscMode');
          const buttonNode = instantiate(miscNode);
          buttonNode.parent = this.node;
          buttonNode.name = 'Buttons';
          const titleNode = instantiate(miscNode);
          titleNode.parent = this.node;
          titleNode.name = 'Titles';

          // title
          for (let i = 0; i < 2; i++) {
            const newLabel = instantiate(this.EnableAllCompositeModeButton.getChildByName('Label'));
            newLabel.setPosition(x + (i > 0 ? 50 + width * 2 : 150), y, 0.0);
            newLabel.setScale(0.75, 0.75, 0.75);
            newLabel.parent = titleNode;
            const labelComponent = newLabel.getComponent(Label);
            labelComponent.string = i ? '----------Composite Mode----------' : '----------Single Mode----------';
            labelComponent.color = Color.WHITE;
            labelComponent.overflow = 0;
            this.labelComponentList[this.labelComponentList.length] = labelComponent;
          }
          y -= height;
          // single
          let currentRow = 0;
          for (let i = 0; i < this.strSingle.length; i++, currentRow++) {
            if (i === this.strSingle.length >> 1) {
              x += width;
              currentRow = 0;
            }
            const newNode = i ? instantiate(this.singleModeToggle) : this.singleModeToggle;
            newNode.setPosition(x, y - height * currentRow, 0.0);
            newNode.setScale(0.5, 0.5, 0.5);
            newNode.parent = this.singleModeToggle.parent;
            const textComponent = newNode.getComponentInChildren(RichText);
            textComponent.string = this.strSingle[i];
            this.textComponentList[this.textComponentList.length] = textComponent;
            this.textContentList[this.textContentList.length] = textComponent.string;
            newNode.on(Toggle.EventType.TOGGLE, this.toggleSingleMode, this);
            this.singleModeToggleList[i] = newNode;
          }
          x += width;
          // buttons
          this.EnableAllCompositeModeButton.setPosition(x + 15, y, 0.0);
          this.EnableAllCompositeModeButton.setScale(0.5, 0.5, 0.5);
          this.EnableAllCompositeModeButton.on(Button.EventType.CLICK, this.enableAllCompositeMode, this);
          this.EnableAllCompositeModeButton.parent = buttonNode;
          let labelComponent = this.EnableAllCompositeModeButton.getComponentInChildren(Label);
          this.labelComponentList[this.labelComponentList.length] = labelComponent;
          const changeColorButton = instantiate(this.EnableAllCompositeModeButton);
          changeColorButton.setPosition(x + 90, y, 0.0);
          changeColorButton.setScale(0.5, 0.5, 0.5);
          changeColorButton.on(Button.EventType.CLICK, this.changeTextColor, this);
          changeColorButton.parent = buttonNode;
          labelComponent = changeColorButton.getComponentInChildren(Label);
          labelComponent.string = 'TextColor';
          this.labelComponentList[this.labelComponentList.length] = labelComponent;
          const HideButton = instantiate(this.EnableAllCompositeModeButton);
          HideButton.setPosition(x + 200, y, 0.0);
          HideButton.setScale(0.5, 0.5, 0.5);
          HideButton.on(Button.EventType.CLICK, this.hideUI, this);
          HideButton.parent = this.node.parent;
          labelComponent = HideButton.getComponentInChildren(Label);
          labelComponent.string = 'Hide UI';
          this.labelComponentList[this.labelComponentList.length] = labelComponent;
          this.hideButtonLabel = labelComponent;

          // misc
          y -= 40;
          for (let i = 0; i < this.strMisc.length; i++) {
            const newNode = instantiate(this.compositeModeToggle);
            newNode.setPosition(x, y - height * i, 0.0);
            newNode.setScale(0.5, 0.5, 0.5);
            newNode.parent = miscNode;
            const textComponent = newNode.getComponentInChildren(RichText);
            textComponent.string = this.strMisc[i];
            this.textComponentList[this.textComponentList.length] = textComponent;
            this.textContentList[this.textContentList.length] = textComponent.string;
            const toggleComponent = newNode.getComponent(Toggle);
            toggleComponent.isChecked = i ? true : false;
            newNode.on(Toggle.EventType.TOGGLE, i ? this.toggleLightingWithAlbedo : this.toggleCSMColoration, this);
            this.miscModeToggleList[i] = newNode;
          }

          // composite
          y -= 150;
          for (let i = 0; i < this.strComposite.length; i++) {
            const newNode = i ? instantiate(this.compositeModeToggle) : this.compositeModeToggle;
            newNode.setPosition(x, y - height * i, 0.0);
            newNode.setScale(0.5, 0.5, 0.5);
            newNode.parent = this.compositeModeToggle.parent;
            const textComponent = newNode.getComponentInChildren(RichText);
            textComponent.string = this.strComposite[i];
            this.textComponentList[this.textComponentList.length] = textComponent;
            this.textContentList[this.textContentList.length] = textComponent.string;
            newNode.on(Toggle.EventType.TOGGLE, this.toggleCompositeMode, this);
            this.compositeModeToggleList[i] = newNode;
          }
        }
        isTextMatched(textUI, textDescription) {
          let tempText = new String(textUI);
          const findIndex = tempText.search('>');
          if (findIndex === -1) {
            return textUI === textDescription;
          } else {
            tempText = tempText.substr(findIndex + 1);
            tempText = tempText.substr(0, tempText.search('<'));
            return tempText === textDescription;
          }
        }
        toggleSingleMode(toggle) {
          const debugView = director.root.debugView;
          const textComponent = toggle.getComponentInChildren(RichText);
          for (let i = 0; i < this.strSingle.length; i++) {
            if (this.isTextMatched(textComponent.string, this.strSingle[i])) {
              debugView.singleMode = i;
            }
          }
        }
        toggleCompositeMode(toggle) {
          const debugView = director.root.debugView;
          const textComponent = toggle.getComponentInChildren(RichText);
          for (let i = 0; i < this.strComposite.length; i++) {
            if (this.isTextMatched(textComponent.string, this.strComposite[i])) {
              debugView.enableCompositeMode(i, toggle.isChecked);
            }
          }
        }
        toggleLightingWithAlbedo(toggle) {
          const debugView = director.root.debugView;
          debugView.lightingWithAlbedo = toggle.isChecked;
        }
        toggleCSMColoration(toggle) {
          const debugView = director.root.debugView;
          debugView.csmLayerColoration = toggle.isChecked;
        }
        enableAllCompositeMode(button) {
          const debugView = director.root.debugView;
          debugView.enableAllCompositeMode(true);
          for (let i = 0; i < this.compositeModeToggleList.length; i++) {
            const toggleComponent = this.compositeModeToggleList[i].getComponent(Toggle);
            toggleComponent.isChecked = true;
          }
          let toggleComponent = this.miscModeToggleList[0].getComponent(Toggle);
          toggleComponent.isChecked = false;
          debugView.csmLayerColoration = false;
          toggleComponent = this.miscModeToggleList[1].getComponent(Toggle);
          toggleComponent.isChecked = true;
          debugView.lightingWithAlbedo = true;
        }
        hideUI(button) {
          const titleNode = this.node.getChildByName('Titles');
          const activeValue = !titleNode.active;
          this.singleModeToggleList[0].parent.active = activeValue;
          this.miscModeToggleList[0].parent.active = activeValue;
          this.compositeModeToggleList[0].parent.active = activeValue;
          this.EnableAllCompositeModeButton.parent.active = activeValue;
          titleNode.active = activeValue;
          this.hideButtonLabel.string = activeValue ? 'Hide UI' : 'Show UI';
        }
        changeTextColor(button) {
          this._currentColorIndex++;
          if (this._currentColorIndex >= this.strColor.length) {
            this._currentColorIndex = 0;
          }
          for (let i = 0; i < this.textComponentList.length; i++) {
            this.textComponentList[i].string = this.strColor[this._currentColorIndex] + this.textContentList[i] + '</color>';
          }
          for (let i = 0; i < this.labelComponentList.length; i++) {
            this.labelComponentList[i].color = this.color[this._currentColorIndex];
          }
        }
        onLoad() {}
        update(deltaTime) {}
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "compositeModeToggle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "singleModeToggle", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "EnableAllCompositeModeButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Decorator.ts", ['cc', './BehaviorTree.ts', './BTreeNode.ts'], function (exports) {
  var cclegacy, BehaviorTree, BTreeNode;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BehaviorTree = module.BehaviorTree;
    }, function (module) {
      BTreeNode = module.BTreeNode;
    }],
    execute: function () {
      cclegacy._RF.push({}, "0455agxsbxHlYleJPDpJX3l", "Decorator", undefined);

      /** 
       * 装饰器是条件语句只能附加在其他节点上并且定义所附加的节点是否执行 
       * 如果装饰器是true 它所在的子树会被执行，如果是false 所在的子树不会被执行
       */
      class Decorator extends BTreeNode {
        constructor(node) {
          super();
          this.node = void 0;
          if (node) this.node = BehaviorTree.getNode(node);
        }
        setNode(node) {
          this.node = BehaviorTree.getNode(node);
        }
        start() {
          this.node.setControl(this);
          this.node.start();
          super.start();
        }
        end() {
          this.node.end();
        }
        run(blackboard) {
          this.node.run(blackboard);
        }
      }
      exports('Decorator', Decorator);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Defines.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "82d3a9c71JEkI95d3qscHm8", "Defines", undefined);
      /*
       * @Author: dgflash
       * @Date: 2021-11-18 11:21:32
       * @LastEditors: dgflash
       * @LastEditTime: 2023-01-09 11:52:38
       */
      /*** 界面回调参数对象定义 */
      /** 本类型仅供gui模块内部使用，请勿在功能逻辑中使用 */
      class ViewParams {
        constructor() {
          /** 界面配置 */
          this.config = null;
          /** 传递给打开界面的参数 */
          this.params = null;
          /** 窗口事件 */
          this.callbacks = null;
          /** 是否在使用状态 */
          this.valid = true;
          /** 界面根节点 */
          this.node = null;
        }
      }
      exports('ViewParams', ViewParams);

      /** 弹框层回调对象定义（废弃） */
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DelegateComponent.ts", ['cc', './Oops.ts'], function (exports) {
  var cclegacy, Component, _decorator, oops;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "d8f1fGRD7dBzIeBSkOpd/Py", "DelegateComponent", undefined);
      const {
        ccclass
      } = _decorator;

      /** 窗口事件触发组件 */
      let DelegateComponent = exports('DelegateComponent', (_dec = ccclass('DelegateComponent'), _dec(_class = class DelegateComponent extends Component {
        constructor(...args) {
          super(...args);
          /** 视图参数 */
          this.vp = null;
          /** 界面关闭回调 - 包括关闭动画播放完 */
          this.onHide = null;
        }
        /** 窗口添加 */
        add() {
          // 触发窗口组件上添加到父节点后的事件
          this.applyComponentsFunction(this.node, "onAdded", this.vp.params);
          if (typeof this.vp.callbacks.onAdded === "function") {
            this.vp.callbacks.onAdded(this.node, this.vp.params);
          }
        }

        /** 删除节点，该方法只能调用一次，将会触发onBeforeRemoved回调 */
        remove(isDestroy) {
          if (this.vp.valid) {
            // 触发窗口移除舞台之前事件
            this.applyComponentsFunction(this.node, "onBeforeRemove", this.vp.params);

            //  通知外部对象窗口组件上移除之前的事件（关闭窗口前的关闭动画处理）
            if (typeof this.vp.callbacks.onBeforeRemove === "function") {
              this.vp.callbacks.onBeforeRemove(this.node, () => {
                this.removed(this.vp, isDestroy);
              });
            } else {
              this.removed(this.vp, isDestroy);
            }
          }
        }

        /** 窗口组件中触发移除事件与释放窗口对象 */
        removed(vp, isDestroy) {
          vp.valid = false;
          if (typeof vp.callbacks.onRemoved === "function") {
            vp.callbacks.onRemoved(this.node, vp.params);
          }

          // 界面移除舞台事件
          this.onHide && this.onHide(vp);
          if (isDestroy) {
            // 释放界面显示对象
            this.node.destroy();

            // 释放界面相关资源
            oops.res.release(vp.config.prefab);

            // oops.log.logView(`【界面管理】释放【${vp.config.prefab}】界面资源`);
          } else {
            this.node.removeFromParent();
          }
        }
        onDestroy() {
          // 触发窗口组件上窗口移除之后的事件
          this.applyComponentsFunction(this.node, "onRemoved", this.vp.params);
          this.vp = null;
        }
        applyComponentsFunction(node, funName, params) {
          for (let i = 0; i < node.components.length; i++) {
            let component = node.components[i];
            let func = component[funName];
            if (func) {
              func.call(component, params);
            }
          }
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Demo.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Oops.ts', './LabelChange.ts', './GameUIConfig.ts', './SingletonModuleComp.ts', './TipsManager.ts', './RoleViewInfoComp.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Component, oops, LabelChange, UIID, smc, tips, RoleViewInfoComp;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      LabelChange = module.LabelChange;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      smc = module.smc;
    }, function (module) {
      tips = module.tips;
    }, function (module) {
      RoleViewInfoComp = module.RoleViewInfoComp;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "46770277MVCUJmttx/Kqt/a", "Demo", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      // 视图层实体是空的
      let Demo = exports('Demo', (_dec = ccclass('Demo'), _dec2 = property(LabelChange), _dec(_class = (_class2 = class Demo extends Component {
        constructor(...args) {
          super(...args);
          this.lang = true;
          _initializerDefineProperty(this, "labChange", _descriptor, this);
        }
        async onLoad() {
          // var path = "gui/prefab/role_info_base";
          // var node = await ViewUtil.createPrefabNodeAsync(path);
          // node.parent = this.node;
        }
        start() {
          // resLoader.dump();

          // console.log("当前图集数量", dynamicAtlasManager.atlasCount);
          // console.log("可以创建的最大图集数量", dynamicAtlasManager.maxAtlasCount);
          // console.log("创建的图集的宽高", dynamicAtlasManager.textureSize);
          // console.log("可以添加进图集的图片的最大尺寸", dynamicAtlasManager.maxFrameSize);
          // console.log("可以添加进图集的图片的最大尺寸", dynamicAtlasManager.maxFrameSize);

          // console.log("是否是原生平台", sys.isNative);
          // console.log("是否是浏览器", sys.isBrowser);
          // console.log("是否是移动端平台", sys.isMobile);
          // console.log("是否是小端序", sys.isLittleEndian);
          // console.log("运行平台或环境", sys.platform);
          // console.log("运行环境的语言", sys.language);
          // console.log("运行环境的语言代码", sys.languageCode);
          // console.log("当前运行系统", sys.os);
          // console.log("运行系统版本字符串", sys.osVersion);
          // console.log("当前系统主版本", sys.osMainVersion);
          // console.log("当前运行的浏览器类型", sys.browserType);
          // console.log("获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 `sys.NetworkType.LAN`", sys.getNetworkType());
          // console.log("取当前设备的电池电量，如果电量无法获取，默认将返回 1", sys.getBatteryLevel());

          this.labChange.changeTo(0.5, 250, () => {});

          // this.test_zip();
        }

        // private async test_zip() {
        //     var z = new ZipLoader();
        //     var zip_path = "zip/data";
        //     await z.load(zip_path);
        //     var a = await z.getJson(zip_path, "data/a.json");
        //     console.log(a);
        //     var s = await z.getSpriteFrame(zip_path, "data/Dungeon.png");
        //     console.log(s);
        // }

        btn_long(event, data) {
          oops.gui.toast(data, true);
        }

        /** 升级 */
        btn_level_up(event, data) {
          var role = smc.account.AccountModel.role;
          role.upgrade();
          // role.remove(RoleViewComp);
          // resLoader.releaseDir("content/role");
        }

        /** 攻击 */
        btn_attack(event, data) {
          var role = smc.account.AccountModel.role;
          role.attack();

          // role.load();
          // role.RoleView.node.parent = oops.gui.game;
        }

        /** 转职弓箭 */
        btn_change_job9(event, data) {
          var role = smc.account.AccountModel.role;
          role.changeJob(9);
        }

        /** 转职匕首 */
        btn_change_job5(event, data) {
          var role = smc.account.AccountModel.role;
          role.changeJob(5);
        }

        /** 转职刀 */
        btn_change_job1(event, data) {
          var role = smc.account.AccountModel.role;
          role.changeJob(1);
        }

        /** 打开角色界面 */
        async btn_open_role_info(event, data) {
          var role = smc.account.AccountModel.role;
          var node = await oops.gui.openAsync(UIID.Demo_Role_Info, "传递参数");
          if (node) role.add(node.getComponent(RoleViewInfoComp));
        }

        /** 多语言切换 */
        btn_language(event, data) {
          console.log(oops.language.getLangByID("notify_show"));
          if (this.lang == false) {
            this.lang = true;
            oops.language.setLanguage("zh", () => {});
          } else {
            this.lang = false;
            oops.language.setLanguage("en", () => {});
          }
        }

        /** 弹出提示框 */
        btn_common_prompt(event, data) {
          tips.test(() => {});
          tips.test(() => {});
          tips.confirm("内容1", () => {}, "确认1");
          tips.confirm("内容2", () => {}, "确认2");
        }

        /** 漂浮提示框 */
        btn_notify_show(event, data) {
          oops.gui.toast("common_prompt_content", true);
        }

        /** 加载提示 */
        netInstableOpen(event, data) {
          // tips.netInstableOpen();
          oops.gui.waitOpen();
          setTimeout(() => {
            // tips.netInstableClose();
            oops.gui.waitClose();
          }, 2000);
        }

        /** 背景音乐 */
        btn_audio_open1(event, data) {
          oops.audio.volumeMusic = 0.5;
          oops.audio.playMusicLoop("audios/nocturne");
        }

        /** 背景音效 */
        btn_audio_open2(event, data) {
          oops.audio.playEffect("audios/Gravel");
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "labChange", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DirectorExt.ts", ['cc'], function () {
  var cclegacy, Director, director, js;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Director = module.Director;
      director = module.director;
      js = module.js;
    }],
    execute: function () {
      cclegacy._RF.push({}, "37f48DDLR1EXKhzn+7pLlWB", "DirectorExt", undefined);

      /** 全局游戏时间缩放 */
      {
        //@ts-ignore
        if (!Director.prototype["__$cc-director-speed-extension$__"]) {
          //@ts-ignore
          Director.prototype["__$cc-director-speed-extension$__"] = true;
          let oldTick = director.tick.bind(director);
          director.tick = function (dt) {
            dt *= director.globalGameTimeScale;
            oldTick(dt);
          };
          js.mixin(Director.prototype, {
            globalGameTimeScale: 1
          });
        }
      }
      // director.globalGameTimeScale = 0.5;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DrawMeshSector.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Material, _decorator, Component, MeshRenderer, macro, Vec3, gfx, utils;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Material = module.Material;
      _decorator = module._decorator;
      Component = module.Component;
      MeshRenderer = module.MeshRenderer;
      macro = module.macro;
      Vec3 = module.Vec3;
      gfx = module.gfx;
      utils = module.utils;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "ea0c13ef6VL451GZLWgDtle", "DrawMeshSector", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 绘制扇形网格 */
      let DrawMeshSector = exports('DrawMeshSector', (_dec = ccclass('DrawSectorMesh'), _dec2 = property({
        type: Material
      }), _dec3 = property({
        tooltip: "外圈半径"
      }), _dec4 = property({
        tooltip: "内圈半径"
      }), _dec5 = property({
        tooltip: "扇形角度"
      }), _dec(_class = (_class2 = class DrawMeshSector extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "mat", _descriptor, this);
          _initializerDefineProperty(this, "radius", _descriptor2, this);
          _initializerDefineProperty(this, "innerRadius", _descriptor3, this);
          _initializerDefineProperty(this, "angledegree", _descriptor4, this);
        }
        start() {
          this.createMesh();
        }
        createMesh() {
          const model = this.addComponent(MeshRenderer);
          const segments = Math.floor(this.angledegree / 4) + 1; // 三角形个数（平滑度）

          var positions = []; // 顶点位置数据

          // 组装顶点数据
          var vertices_count = segments * 2 + 2; // vertices(顶点)的个数与triangles（索引三角形顶点数）匹配
          var vertices = new Array(vertices_count);
          var angleRad = this.angledegree * macro.RAD; // 角度转弧度
          var angleCur = angleRad;
          var angledelta = angleRad / segments; // 每个三角形的弧度
          for (var i = 0; i < vertices_count; i += 2) {
            // 扇形每二个三角形之间共用2个顶点，所有生成时每次循环生成二个顶点
            var cosA = Math.cos(angleCur);
            var sinA = Math.sin(angleCur);
            vertices[i] = new Vec3(this.radius * cosA, 0, this.radius * sinA); // 已知扇形外圈半径为斜边求x、z值，得到第一个顶点位置（外圈半径顶点）
            vertices[i + 1] = new Vec3(this.innerRadius * cosA, 0, this.innerRadius * sinA); // 已知扇形内圈半径为斜边求x、z值，得到第二个顶点位置（内圈半径顶点）
            angleCur -= angledelta;
            positions.push(vertices[i].x);
            positions.push(vertices[i].y);
            positions.push(vertices[i].z);
            positions.push(vertices[i + 1].x);
            positions.push(vertices[i + 1].y);
            positions.push(vertices[i + 1].z);
          }

          // 组装三角形数据
          var indice_count = segments * 6; // 扇形外圈与扇形内圈会生成一个四边形，即二个三角形，6个顶点索引
          var indices = new Array(indice_count);
          for (var i = 0, vi = 0; i < indice_count; i += 6, vi += 2) {
            // i为三角形顶点索引号，vi为顶点位置索引
            indices[i] = vi;
            indices[i + 1] = vi + 3;
            indices[i + 2] = vi + 1;
            indices[i + 3] = vi + 2;
            indices[i + 4] = vi + 3;
            indices[i + 5] = vi;
          }

          // 组装UV数据
          var uvs = [];
          for (var i = 0; i < vertices_count; i++) {
            var u = vertices[i].x / this.radius / 2 + 0.5;
            var v = vertices[i].z / this.radius / 2 + 0.5;
            uvs.push(u, v);
          }
          const primitiveMode = gfx.PrimitiveMode.TRIANGLE_FAN;
          const attributes = [{
            name: gfx.AttributeName.ATTR_NORMAL,
            format: gfx.Format.RGB32F
          }];
          var IGeometry = {
            positions: positions,
            indices: indices,
            uvs: uvs,
            primitiveMode: primitiveMode,
            // 默认值效果一样，需要研究作用
            attributes: attributes // 默认值效果一样，需要研究作用
          };

          const mesh = utils.createMesh(IGeometry);
          model.mesh = mesh;
          model.material = this.mat;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mat", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "radius", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "innerRadius", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "angledegree", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 60;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ECS.ts", ['cc', './ECSComp.ts', './ECSEntity.ts', './ECSMatcher.ts', './ECSModel.ts', './ECSSystem.ts'], function (exports) {
  var cclegacy, ECSComp, ECSEntity, ECSMatcher, ECSModel, ECSSystem, ECSRootSystem, ECSComblockSystem;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ECSComp = module.ECSComp;
    }, function (module) {
      ECSEntity = module.ECSEntity;
    }, function (module) {
      ECSMatcher = module.ECSMatcher;
    }, function (module) {
      ECSModel = module.ECSModel;
    }, function (module) {
      ECSSystem = module.ECSSystem;
      ECSRootSystem = module.ECSRootSystem;
      ECSComblockSystem = module.ECSComblockSystem;
    }],
    execute: function () {
      exports('ecs', void 0);
      cclegacy._RF.push({}, "be87fT76plLkaUKEYpkuV0n", "ECS", undefined);

      /** Entity-Component-System（实体-组件-系统）框架 */
      let ecs;
      (function (_ecs) {
        /** 实体 - 一个概念上的定义，指的是游戏世界中的一个独特物体，是一系列组件的集合 */

        /** 组件 - 一堆数据的集合，即不存在任何的行为，只用来存储状态 */

        /** 系统 - 关注实体上组件数据变化，处理游戏逻辑 */

        /** 根系统 - 驱动游戏中所有系统工作 */

        /** 处理游戏逻辑系统对象 - 继承此对象实现自定义业务逻辑 */

        /** 实体 - 一个概念上的定义，指的是游戏世界中的一个独特物体，是一系列组件的集合 */
        const Entity = _ecs.Entity = ECSEntity;
        const Comp = _ecs.Comp = ECSComp;
        const System = _ecs.System = ECSSystem;
        const RootSystem = _ecs.RootSystem = ECSRootSystem;
        const ComblockSystem = _ecs.ComblockSystem = ECSComblockSystem;

        //#region 接口

        /** 组件接口 */

        /** 实体匹配器接口 */

        /**
         * 监听组件首次添加到实体上时，在ComblockSystem上实现这个接口
         * 1. entityEnter会在update方法之前执行，实体进入后，不会再次进入entityEnter方法中
         * 2. 当实体从当前System移除，下次再次符合条件进入System也会执行上述流程
         * @example
        export class RoleUpgradeSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
            filter(): ecs.IMatcher {
                return ecs.allOf(RoleUpgradeComp, RoleModelLevelComp);
            }
              entityEnter(e: Role): void {
                e.remove(RoleUpgradeComp);
            }
        }
         */

        /** 监听组件从实体上移除时，在ComblockSystem上实现这个接口 */

        /** 监听系统第一次执行update处理实体时，在ComblockSystem上实现这个接口 */

        /** 监听系统执行update处理实体时，在ComblockSystem上实现这个接口 */

        //#endregion

        /**
         * 注册组件到ecs系统中
         * @param name   由于js打包会改变类名，所以这里必须手动传入组件的名称
         * @param canNew 标识是否可以new对象。想继承自Cocos Creator的组件就不能去new，需要写成@ecs.register('name', false)
         * @example
        // 注册实体
        @ecs.register('Role')
        export class Role extends ecs.Entity {
          }
          // 注册数据组件
        @ecs.register('RoleModel')
        export class RoleModelComp extends ecs.Comp {
            id: number = -1;
              reset() {
                this.id =  -1;
            }
        }
          // 注册系统组件
        @ecs.register('Initialize')
        export class InitResSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
          }
          // 注册显示对象组件
        @ccclass('RoleViewComp')
        @ecs.register('RoleView', false)
        export class RoleViewComp extends CCComp {
            onLoad(){
                
            }
        }
        */
        function register(name, canNew = true) {
          return function (ctor) {
            // 注册系统
            if (ctor.s) {
              var system = ECSModel.systems.get(name);
              if (system == null) {
                system = new ecs.System();
                ECSModel.systems.set(name, system);
              }
              system.add(new ctor());
            }
            // 注册实体
            else if (ctor.tid == undefined) {
              ECSModel.entityCtors.set(ctor, name);
            }
            // 注册组件
            else {
              if (ctor.tid === -1) {
                ctor.tid = ECSModel.compTid++;
                ctor.compName = name;
                if (canNew) {
                  ECSModel.compCtors.push(ctor);
                  ECSModel.compPools.set(ctor.tid, []);
                } else {
                  ECSModel.compCtors.push(null);
                }
                ECSModel.compAddOrRemove.set(ctor.tid, []);
              } else {
                throw new Error(`重复注册组件： ${name}.`);
              }
            }
          };
        }
        _ecs.register = register;
        function getEntity(ctor) {
          // 获取实体对象名
          var entityName = ECSModel.entityCtors.get(ctor);
          if (entityName == undefined) console.error(`${ctor.name} 实体没有注册`);

          // 获取实体对象池
          var entitys = ECSModel.entityPool.get(entityName) || [];
          var entity = entitys.pop();

          // 缓存中没有同类实体，则创建一个新的
          if (!entity) {
            entity = new ctor();
            entity.eid = ECSModel.eid++; // 实体唯一编号
            entity.name = entityName;
          }

          // 触发实体初始化逻辑
          if (entity.init) entity.init();else console.error(`${ctor.name} 实体缺少 init 方法初始化默认组件`);
          ECSModel.eid2Entity.set(entity.eid, entity);
          return entity;
        }
        _ecs.getEntity = getEntity;
        function query(matcher) {
          let group = ECSModel.groups.get(matcher.mid);
          if (!group) {
            group = ECSModel.createGroup(matcher);
            ECSModel.eid2Entity.forEach(group.onComponentAddOrRemove, group);
          }
          return group.matchEntities;
        }
        _ecs.query = query;
        function clear() {
          ECSModel.eid2Entity.forEach(entity => {
            entity.destroy();
          });
          ECSModel.groups.forEach(group => {
            group.clear();
          });
          ECSModel.compAddOrRemove.forEach(callbackLst => {
            callbackLst.length = 0;
          });
          ECSModel.eid2Entity.clear();
          ECSModel.groups.clear();
        }
        _ecs.clear = clear;
        function getEntityByEid(eid) {
          return ECSModel.eid2Entity.get(eid);
        }
        _ecs.getEntityByEid = getEntityByEid;
        function activeEntityCount() {
          return ECSModel.eid2Entity.size;
        }
        _ecs.activeEntityCount = activeEntityCount;
        /** 创建实体 */
        function createEntity() {
          let entity = new Entity();
          entity.eid = ECSModel.eid++; // 实体id也是有限的资源
          ECSModel.eid2Entity.set(entity.eid, entity);
          return entity;
        }

        /**
         * 指定一个组件创建实体，返回组件对象。
         * @param ctor 
         */
        function createEntityWithComp(ctor) {
          let entity = createEntity();
          return entity.add(ctor);
        }

        //#region 过滤器
        /**
         * 表示只关心这些组件的添加和删除动作。虽然实体可能有这些组件之外的组件，但是它们的添加和删除没有被关注，所以不会存在对关注之外的组件
         * 进行添加操作引发Group重复添加实体。
         * @param args 
         * @example
         * ecs.allOf(AComponent, BComponent, CComponent);
         */
        function allOf(...args) {
          return new ECSMatcher().allOf(...args);
        }
        _ecs.allOf = allOf;
        function anyOf(...args) {
          return new ECSMatcher().anyOf(...args);
        }
        _ecs.anyOf = anyOf;
        function onlyOf(...args) {
          return new ECSMatcher().onlyOf(...args);
        }
        _ecs.onlyOf = onlyOf;
        function excludeOf(...args) {
          return new ECSMatcher().excludeOf(...args);
        }
        _ecs.excludeOf = excludeOf;
        function getSingleton(ctor) {
          if (!ECSModel.tid2comp.has(ctor.tid)) {
            let comp = createEntityWithComp(ctor);
            ECSModel.tid2comp.set(ctor.tid, comp);
          }
          return ECSModel.tid2comp.get(ctor.tid);
        }
        _ecs.getSingleton = getSingleton;
        function addSingleton(obj) {
          let tid = obj.constructor.tid;
          if (!ECSModel.tid2comp.has(tid)) {
            ECSModel.tid2comp.set(tid, obj);
          }
        }
        _ecs.addSingleton = addSingleton;
      })(ecs || (ecs = exports('ecs', {})));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ECSComp.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "3d017ZhAZRH4bPfpLr5++8F", "ECSComp", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-09-01 18:00:28
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-05 14:03:54
       */
      /** 
       * 组件抽象类
       * 注：建议组件里面只放数据可能在实际写代码会碰到一些比较麻烦的问题，如果是单纯对组件内的数据操作可以在组件里面写方法
       */
      class ECSComp {
        constructor() {
          /** 拥有该组件的实体 */
          this.ent = void 0;
          /**
           * 是否可回收组件对象，默认情况下都是可回收的
           * 注：如果该组件对象是由ecs系统外部创建的，则不可回收，需要用户自己手动进行回收
           */
          this.canRecycle = true;
        }
        /**
         * 组件被回收时会调用这个接口。可以在这里重置数据，或者解除引用
         * 注：不要偷懒，除非你能确定并保证组件在复用时，里面的数据是先赋值然后再使用
         */
      }
      exports('ECSComp', ECSComp);
      /** 组件的类型编号，-1表示未给该组件分配编号 */
      ECSComp.tid = -1;
      /** 组件名 */
      ECSComp.compName = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ECSEntity.ts", ['cc', './ECSMask.ts', './ECSModel.ts'], function (exports) {
  var cclegacy, ECSMask, ECSModel;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ECSMask = module.ECSMask;
    }, function (module) {
      ECSModel = module.ECSModel;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1fb62WC3PZPvLhjoZQfrREJ", "ECSEntity", undefined);

      //#region 辅助方法

      /**
       * 实体身上组件有增删操作，广播通知对应的观察者
       * @param entity 实体对象
       * @param componentTypeId 组件类型id
       */
      function broadcastCompAddOrRemove(entity, componentTypeId) {
        let events = ECSModel.compAddOrRemove.get(componentTypeId);
        for (let i = events.length - 1; i >= 0; i--) {
          events[i](entity);
        }
        // 判断是不是删了单例组件
        if (ECSModel.tid2comp.has(componentTypeId)) {
          ECSModel.tid2comp.delete(componentTypeId);
        }
      }

      /**
       * 创建组件对象
       * @param ctor
       */
      function createComp(ctor) {
        var cct = ECSModel.compCtors[ctor.tid];
        if (!cct) {
          throw Error(`没有找到该组件的构造函数，检查${ctor.compName}是否为不可构造的组件`);
        }
        let comps = ECSModel.compPools.get(ctor.tid);
        let component = comps.pop() || new cct();
        return component;
      }

      /**
       * 销毁实体
       * 
       * 缓存销毁的实体，下次新建实体时会优先从缓存中拿。
       * @param entity 
       */
      function destroyEntity(entity) {
        if (ECSModel.eid2Entity.has(entity.eid)) {
          var entitys = ECSModel.entityPool.get(entity.name);
          if (entitys == null) {
            entitys = [];
            ECSModel.entityPool.set(entity.name, entitys);
          }
          entitys.push(entity);
          ECSModel.eid2Entity.delete(entity.eid);
        } else {
          console.warn('试图销毁不存在的实体');
        }
      }

      //#endregion

      /** ECS实体对象 */
      class ECSEntity {
        constructor() {
          /** 实体唯一标识，不要手动修改 */
          this.eid = -1;
          /** 实体对象名 */
          this.name = "";
          /** 组件过滤数据 */
          this.mask = new ECSMask();
          /** 当前实体身上附加的组件构造函数 */
          this.compTid2Ctor = new Map();
          /** 配合 entity.remove(Comp, false)， 记录组件实例上的缓存数据，在添加时恢复原数据 */
          this.compTid2Obj = new Map();
          this._parent = null;
          this._children = null;
        }
        /** 父实体 */
        get parent() {
          return this._parent;
        }
        /** 子实体集合 */
        get children() {
          if (this._children == null) {
            this._children = new Map();
          }
          return this._children;
        }

        /**
         * 添加子实体
         * @param entity 被添加的实体对象
         */
        addChild(entity) {
          entity._parent = this;
          this.children.set(entity.eid, entity);
        }

        /**
         * 移除子实体
         * @param entity 被移除的实体对象
         * @returns 
         */
        removeChild(entity) {
          if (this.children == null) return;
          this.children.delete(entity.eid);
          if (this.children.size == 0) {
            this._children = null;
          }
        }

        /**
         * 根据组件类动态创建组件，并通知关心的系统。如果实体存在了这个组件，那么会先删除之前的组件然后添加新的
         * 
         * 注意：不要直接new Component，new来的Component不会从Component的缓存池拿缓存的数据
         * @param componentTypeId   组件类
         * @param isReAdd           true-表示用户指定这个实体可能已经存在了该组件，那么再次add组件的时候会先移除该组件然后再添加一遍。false-表示不重复添加组件
         */

        add(ctor, isReAdd = false) {
          if (typeof ctor === 'function') {
            let compTid = ctor.tid;
            if (ctor.tid === -1) {
              throw Error('组件未注册！');
            }
            if (this.compTid2Ctor.has(compTid)) {
              // 判断是否有该组件，如果有则先移除
              if (isReAdd) {
                this.remove(ctor);
              } else {
                console.log(`已经存在组件：${ctor.compName}`);
                // @ts-ignore
                return this[ctor.compName];
              }
            }
            this.mask.set(compTid);
            let comp;
            if (this.compTid2Obj.has(compTid)) {
              comp = this.compTid2Obj.get(compTid);
              this.compTid2Obj.delete(compTid);
            } else {
              // 创建组件对象
              comp = createComp(ctor);
            }

            // 将组件对象直接附加到实体对象身上，方便直接获取
            // @ts-ignore
            this[ctor.compName] = comp;
            this.compTid2Ctor.set(compTid, ctor);
            comp.ent = this;
            // 广播实体添加组件的消息
            broadcastCompAddOrRemove(this, compTid);
            return comp;
          } else {
            let tmpCtor = ctor.constructor;
            let compTid = tmpCtor.tid;
            // console.assert(compTid !== -1 || !compTid, '组件未注册！');
            // console.assert(this.compTid2Ctor.has(compTid), '已存在该组件！');
            if (compTid === -1 || compTid == null) {
              throw Error('组件未注册');
            }
            if (this.compTid2Ctor.has(compTid)) {
              throw Error('已经存在该组件');
            }
            this.mask.set(compTid);
            //@ts-ignore
            this[tmpCtor.compName] = ctor;
            this.compTid2Ctor.set(compTid, tmpCtor);
            //@ts-ignore
            ctor.ent = this;
            //@ts-ignore
            ctor.canRecycle = false;
            broadcastCompAddOrRemove(this, compTid);
            return this;
          }
        }

        /**
         * 批量添加组件
         * @param ctors 组件类
         * @returns 
         */
        addComponents(...ctors) {
          for (let ctor of ctors) {
            this.add(ctor);
          }
          return this;
        }

        /**
         * 获取一个组件实例
         * @param ctor 组件类
         */

        get(ctor) {
          // @ts-ignore
          return this[ctor.compName];
        }

        /**
         * 组件是否在实体存在内
         * @param ctor 组件类
         */
        has(ctor) {
          if (typeof ctor == "number") {
            return this.mask.has(ctor);
          } else {
            return this.compTid2Ctor.has(ctor.tid);
          }
        }

        /**
         * 从实体上删除指定组件
         * @param ctor      组件构造函数或者组件Tag
         * @param isRecycle 是否回收该组件对象。对于有些组件上有大量数据，当要描述移除组件但是不想清除组件上的数据是可以
         * 设置该参数为false，这样该组件对象会缓存在实体身上，下次重新添加组件时会将该组件对象添加回来，不会重新从组件缓存
         * 池中拿一个组件来用。
         */
        remove(ctor, isRecycle = true) {
          let hasComp = false;
          //@ts-ignore
          let componentTypeId = ctor.tid;
          //@ts-ignore
          let compName = ctor.compName;
          if (this.mask.has(componentTypeId)) {
            hasComp = true;
            //@ts-ignore
            let comp = this[ctor.compName];
            //@ts-ignore
            comp.ent = null;
            if (isRecycle) {
              comp.reset();
              if (comp.canRecycle) {
                ECSModel.compPools.get(componentTypeId).push(comp);
              }
            } else {
              this.compTid2Obj.set(componentTypeId, comp);
            }
          }
          if (hasComp) {
            //@ts-ignore
            this[compName] = null;
            this.mask.delete(componentTypeId);
            this.compTid2Ctor.delete(componentTypeId);
            broadcastCompAddOrRemove(this, componentTypeId);
          }
        }
        _remove(comp) {
          this.remove(comp, false);
        }

        /** 销毁实体，实体会被回收到实体缓存池中 */
        destroy() {
          if (this._children) {
            this._children.forEach(e => {
              this.removeChild(e);
              e.destroy();
            });
          }
          this.compTid2Ctor.forEach(this._remove, this);
          destroyEntity(this);
          this.compTid2Obj.clear();
        }
      }
      exports('ECSEntity', ECSEntity);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ECSGroup.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c21a23o9P5FNJamcMmoYWfs", "ECSGroup", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-09-01 18:00:28
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-05 14:21:54
       */
      class ECSGroup {
        /**
         * 符合规则的实体
         */
        get matchEntities() {
          if (this._entitiesCache === null) {
            this._entitiesCache = Array.from(this._matchEntities.values());
          }
          return this._entitiesCache;
        }

        /**
         * 当前group中实体的数量
         * 
         * 注：不要手动修改这个属性值。
         * 注：其实可以通过this._matchEntities.size获得实体数量，但是需要封装get方法。为了减少一次方法的调用所以才直接创建一个count属性
         */

        /** 获取matchEntities中第一个实体 */
        get entity() {
          return this.matchEntities[0];
        }
        constructor(matcher) {
          /** 实体筛选规则 */
          this.matcher = void 0;
          this._matchEntities = new Map();
          this._entitiesCache = null;
          this.count = 0;
          this._enteredEntities = null;
          this._removedEntities = null;
          this.matcher = matcher;
        }
        onComponentAddOrRemove(entity) {
          if (this.matcher.isMatch(entity)) {
            // Group只关心指定组件在实体身上的添加和删除动作。
            this._matchEntities.set(entity.eid, entity);
            this._entitiesCache = null;
            this.count++;
            if (this._enteredEntities) {
              this._enteredEntities.set(entity.eid, entity);
              this._removedEntities.delete(entity.eid);
            }
          } else if (this._matchEntities.has(entity.eid)) {
            // 如果Group中有这个实体，但是这个实体已经不满足匹配规则，则从Group中移除该实体
            this._matchEntities.delete(entity.eid);
            this._entitiesCache = null;
            this.count--;
            if (this._enteredEntities) {
              this._enteredEntities.delete(entity.eid);
              this._removedEntities.set(entity.eid, entity);
            }
          }
        }
        watchEntityEnterAndRemove(enteredEntities, removedEntities) {
          this._enteredEntities = enteredEntities;
          this._removedEntities = removedEntities;
        }
        clear() {
          var _this$_enteredEntitie, _this$_removedEntitie;
          this._matchEntities.clear();
          this._entitiesCache = null;
          this.count = 0;
          (_this$_enteredEntitie = this._enteredEntities) == null || _this$_enteredEntitie.clear();
          (_this$_removedEntitie = this._removedEntities) == null || _this$_removedEntitie.clear();
        }
      }
      exports('ECSGroup', ECSGroup);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ECSMask.ts", ['cc', './ECSModel.ts'], function (exports) {
  var cclegacy, ECSModel;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ECSModel = module.ECSModel;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d18694PPbtGs5Ipgo/vaJBX", "ECSMask", undefined);
      class ECSMask {
        constructor() {
          this.mask = void 0;
          this.size = 0;
          let length = Math.ceil(ECSModel.compTid / 31);
          this.mask = new Uint32Array(length);
          this.size = length;
        }
        set(num) {
          // https://stackoverflow.com/questions/34896909/is-it-correct-to-set-bit-31-in-javascript
          // this.mask[((num / 32) >>> 0)] |= ((1 << (num % 32)) >>> 0);
          this.mask[num / 31 >>> 0] |= 1 << num % 31;
        }
        delete(num) {
          this.mask[num / 31 >>> 0] &= ~(1 << num % 31);
        }
        has(num) {
          return !!(this.mask[num / 31 >>> 0] & 1 << num % 31);
        }
        or(other) {
          for (let i = 0; i < this.size; i++) {
            // &操作符最大也只能对2^30进行操作，如果对2^31&2^31会得到负数。当然可以(2^31&2^31) >>> 0，这样多了一步右移操作。
            if (this.mask[i] & other.mask[i]) {
              return true;
            }
          }
          return false;
        }
        and(other) {
          for (let i = 0; i < this.size; i++) {
            if ((this.mask[i] & other.mask[i]) != this.mask[i]) {
              return false;
            }
          }
          return true;
        }
        clear() {
          for (let i = 0; i < this.size; i++) {
            this.mask[i] = 0;
          }
        }
      }
      exports('ECSMask', ECSMask);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ECSMatcher.ts", ['cc', './ECSMask.ts', './ECSModel.ts'], function (exports) {
  var cclegacy, ECSMask, ECSModel;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ECSMask = module.ECSMask;
    }, function (module) {
      ECSModel = module.ECSModel;
    }],
    execute: function () {
      cclegacy._RF.push({}, "37e8arlqPlN7amZYyHFvBIp", "ECSMatcher", undefined);
      let macherId = 1;

      /**
       * 筛选规则间是“与”的关系
       * 比如：ecs.Macher.allOf(...).excludeOf(...)表达的是allOf && excludeOf，即实体有“这些组件” 并且 “没有这些组件”
       */
      class ECSMatcher {
        get key() {
          if (!this._key) {
            let s = '';
            for (let i = 0; i < this.rules.length; i++) {
              s += this.rules[i].getKey();
              if (i < this.rules.length - 1) {
                s += ' && ';
              }
            }
            this._key = s;
          }
          return this._key;
        }
        constructor() {
          this.rules = [];
          this._indices = null;
          this.isMatch = void 0;
          this.mid = -1;
          this._key = null;
          this.mid = macherId++;
        }

        /**
         * 匹配器关注的组件索引。在创建Group时，Context根据组件id去给Group关联组件的添加和移除事件。
         */
        get indices() {
          if (this._indices === null) {
            this._indices = [];
            this.rules.forEach(rule => {
              Array.prototype.push.apply(this._indices, rule.indices);
            });
          }
          return this._indices;
        }

        /**
         * 组件间是或的关系，表示关注拥有任意一个这些组件的实体。
         * @param args 组件索引
         */
        anyOf(...args) {
          this.rules.push(new AnyOf(...args));
          this.bindMatchMethod();
          return this;
        }

        /**
         * 组件间是与的关系，表示关注拥有所有这些组件的实体。
         * @param args 组件索引
         */
        allOf(...args) {
          this.rules.push(new AllOf(...args));
          this.bindMatchMethod();
          return this;
        }

        /**
         * 表示关注只拥有这些组件的实体
         * 
         * 注意：
         *  不是特殊情况不建议使用onlyOf。因为onlyOf会监听所有组件的添加和删除事件。
         * @param args 组件索引
         */
        onlyOf(...args) {
          this.rules.push(new AllOf(...args));
          let otherTids = [];
          for (let ctor of ECSModel.compCtors) {
            if (args.indexOf(ctor) < 0) {
              otherTids.push(ctor);
            }
          }
          this.rules.push(new ExcludeOf(...otherTids));
          this.bindMatchMethod();
          return this;
        }

        /**
         * 不包含指定的任意一个组件
         * @param args 
         */
        excludeOf(...args) {
          this.rules.push(new ExcludeOf(...args));
          this.bindMatchMethod();
          return this;
        }
        bindMatchMethod() {
          if (this.rules.length === 1) {
            this.isMatch = this.isMatch1;
          } else if (this.rules.length === 2) {
            this.isMatch = this.isMatch2;
          } else {
            this.isMatch = this.isMatchMore;
          }
        }
        isMatch1(entity) {
          return this.rules[0].isMatch(entity);
        }
        isMatch2(entity) {
          return this.rules[0].isMatch(entity) && this.rules[1].isMatch(entity);
        }
        isMatchMore(entity) {
          for (let rule of this.rules) {
            if (!rule.isMatch(entity)) {
              return false;
            }
          }
          return true;
        }
        clone() {
          let newMatcher = new ECSMatcher();
          newMatcher.mid = macherId++;
          this.rules.forEach(rule => newMatcher.rules.push(rule));
          return newMatcher;
        }
      }
      exports('ECSMatcher', ECSMatcher);
      class BaseOf {
        constructor(...args) {
          this.indices = [];
          this.mask = new ECSMask();
          let componentTypeId = -1;
          let len = args.length;
          for (let i = 0; i < len; i++) {
            if (typeof args[i] === "number") {
              componentTypeId = args[i];
            } else {
              componentTypeId = args[i].tid;
            }
            if (componentTypeId == -1) {
              throw Error('存在没有注册的组件！');
            }
            this.mask.set(componentTypeId);
            if (this.indices.indexOf(componentTypeId) < 0) {
              // 去重
              this.indices.push(componentTypeId);
            }
          }
          if (len > 1) {
            this.indices.sort((a, b) => {
              return a - b;
            }); // 对组件类型id进行排序，这样关注相同组件的系统就能共用同一个group
          }
        }

        toString() {
          return this.indices.join('-'); // 生成group的key
        }
      }

      /**
       * 用于描述包含任意一个这些组件的实体
       */
      class AnyOf extends BaseOf {
        isMatch(entity) {
          // @ts-ignore
          return this.mask.or(entity.mask);
        }
        getKey() {
          return 'anyOf:' + this.toString();
        }
      }

      /**
       * 用于描述包含了“这些”组件的实体，这个实体除了包含这些组件还可以包含其他组件
       */
      class AllOf extends BaseOf {
        isMatch(entity) {
          // @ts-ignore
          return this.mask.and(entity.mask);
        }
        getKey() {
          return 'allOf:' + this.toString();
        }
      }

      /**
       * 不包含指定的任意一个组件
       */
      class ExcludeOf extends BaseOf {
        getKey() {
          return 'excludeOf:' + this.toString();
        }
        isMatch(entity) {
          // @ts-ignore
          return !this.mask.or(entity.mask);
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ECSModel.ts", ['cc', './ECSGroup.ts'], function (exports) {
  var cclegacy, ECSGroup;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ECSGroup = module.ECSGroup;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1d60egM6r9Gta4Op3VABSGM", "ECSModel", undefined);

      /** 组件类型 */

      /** 实体构造器接口 */

      /** 组件构造器接口 */

      /** ECS框架内部数据 */
      class ECSModel {
        /**
         * 创建group，每个group只关心对应组件的添加和删除
         * @param matcher 实体筛选器
         */
        static createGroup(matcher) {
          let group = ECSModel.groups.get(matcher.mid);
          if (!group) {
            group = new ECSGroup(matcher);
            ECSModel.groups.set(matcher.mid, group);
            let careComponentTypeIds = matcher.indices;
            for (let i = 0; i < careComponentTypeIds.length; i++) {
              ECSModel.compAddOrRemove.get(careComponentTypeIds[i]).push(group.onComponentAddOrRemove.bind(group));
            }
          }
          return group;
        }

        /** 系统组件 */
      }
      exports('ECSModel', ECSModel);
      /** 实体自增id */
      ECSModel.eid = 1;
      /** 实体造函数 */
      ECSModel.entityCtors = new Map();
      /** 实体对象缓存池 */
      ECSModel.entityPool = new Map();
      /** 通过实体id查找实体对象 */
      ECSModel.eid2Entity = new Map();
      /** 组件类型id */
      ECSModel.compTid = 0;
      /** 组件缓存池 */
      ECSModel.compPools = new Map();
      /** 组件构造函数 */
      ECSModel.compCtors = [];
      /**
       * 每个组件的添加和删除的动作都要派送到“关心”它们的group上。goup对当前拥有或者之前（删除前）拥有该组件的实体进行组件规则判断。判断该实体是否满足group
       * 所期望的组件组合。
       */
      ECSModel.compAddOrRemove = new Map();
      /** 编号获取组件 */
      ECSModel.tid2comp = new Map();
      /**
       * 缓存的group
       * 
       * key是组件的筛选规则，一个筛选规则对应一个group
       */
      ECSModel.groups = new Map();
      ECSModel.systems = new Map();
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EcsPositionSystem.ts", ['cc', './ECS.ts', './MoveTo2.ts'], function (exports) {
  var cclegacy, ecs, MoveToSystem;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      MoveToSystem = module.MoveToSystem;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b44c4Rrzl9AeaxCJpg32/WA", "EcsPositionSystem", undefined);
      class EcsPositionSystem extends ecs.System {
        constructor() {
          super();
          this.add(new MoveToSystem());
        }
      }
      exports('EcsPositionSystem', EcsPositionSystem);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ECSSystem.ts", ['cc', './ECSModel.ts'], function (exports) {
  var cclegacy, ECSModel;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ECSModel = module.ECSModel;
    }],
    execute: function () {
      cclegacy._RF.push({}, "9261fRWg2RBY5kxbFJsY1QC", "ECSSystem", undefined);

      /** 继承此类实现具体业务逻辑的系统 */
      class ECSComblockSystem {
        /** 构造函数 */
        constructor() {
          this.group = void 0;
          this.dt = 0;
          this.enteredEntities = null;
          this.removedEntities = null;
          this.hasEntityEnter = false;
          this.hasEntityRemove = false;
          this.hasUpdate = false;
          this.tmpExecute = null;
          this.execute = void 0;
          let hasOwnProperty = Object.hasOwnProperty;
          let prototype = Object.getPrototypeOf(this);
          let hasEntityEnter = hasOwnProperty.call(prototype, 'entityEnter');
          let hasEntityRemove = hasOwnProperty.call(prototype, 'entityRemove');
          let hasFirstUpdate = hasOwnProperty.call(prototype, 'firstUpdate');
          let hasUpdate = hasOwnProperty.call(prototype, 'update');
          this.hasEntityEnter = hasEntityEnter;
          this.hasEntityRemove = hasEntityRemove;
          this.hasUpdate = hasUpdate;
          if (hasEntityEnter || hasEntityRemove) {
            this.enteredEntities = new Map();
            this.removedEntities = new Map();
            this.execute = this.execute1;
            this.group = ECSModel.createGroup(this.filter());
            this.group.watchEntityEnterAndRemove(this.enteredEntities, this.removedEntities);
          } else {
            this.execute = this.execute0;
            this.group = ECSModel.createGroup(this.filter());
          }
          if (hasFirstUpdate) {
            this.tmpExecute = this.execute;
            this.execute = this.updateOnce;
          }
        }

        /** 系统实始化 */
        init() {}

        /** 系统释放事件 */
        onDestroy() {}

        /** 是否存在实体 */
        hasEntity() {
          return this.group.count > 0;
        }

        /**
         * 先执行entityEnter，最后执行firstUpdate
         * @param dt 
         * @returns 
         */
        updateOnce(dt) {
          if (this.group.count === 0) {
            return;
          }
          this.dt = dt;

          // 处理刚进来的实体
          if (this.enteredEntities.size > 0) {
            var entities = this.enteredEntities.values();
            for (let entity of entities) {
              this.entityEnter(entity);
            }
            this.enteredEntities.clear();
          }

          // 只执行firstUpdate
          for (let entity of this.group.matchEntities) {
            this.firstUpdate(entity);
          }
          this.execute = this.tmpExecute;
          this.execute(dt);
          this.tmpExecute = null;
        }

        /**
         * 只执行update
         * @param dt 
         * @returns 
         */
        execute0(dt) {
          if (this.group.count === 0) return;
          this.dt = dt;

          // 执行update
          if (this.hasUpdate) {
            for (let entity of this.group.matchEntities) {
              this.update(entity);
            }
          }
        }

        /**
         * 先执行entityRemove，再执行entityEnter，最后执行update
         * @param dt 
         * @returns 
         */
        execute1(dt) {
          if (this.removedEntities.size > 0) {
            if (this.hasEntityRemove) {
              var entities = this.removedEntities.values();
              for (let entity of entities) {
                this.entityRemove(entity);
              }
            }
            this.removedEntities.clear();
          }
          if (this.group.count === 0) return;
          this.dt = dt;

          // 处理刚进来的实体
          if (this.enteredEntities.size > 0) {
            if (this.hasEntityEnter) {
              var entities = this.enteredEntities.values();
              for (let entity of entities) {
                this.entityEnter(entity);
              }
            }
            this.enteredEntities.clear();
          }

          // 执行update
          if (this.hasUpdate) {
            for (let entity of this.group.matchEntities) {
              this.update(entity);
            }
          }
        }

        /**
         * 实体过滤规则
         * 
         * 根据提供的组件过滤实体。
         */
      }
      exports('ECSComblockSystem', ECSComblockSystem);

      /** 根System，对游戏中的System遍历从这里开始，一个System组合中只能有一个RootSystem，可以有多个并行的RootSystem */
      ECSComblockSystem.s = true;
      class ECSRootSystem {
        constructor() {
          this.executeSystemFlows = [];
          this.systemCnt = 0;
        }
        add(system) {
          if (system instanceof ECSSystem) {
            // 将嵌套的System都“摊平”，放在根System中进行遍历，减少execute的频繁进入退出。
            Array.prototype.push.apply(this.executeSystemFlows, system.comblockSystems);
          } else {
            this.executeSystemFlows.push(system);
          }
          this.systemCnt = this.executeSystemFlows.length;
          return this;
        }
        init() {
          // 自动注册系统组件
          ECSModel.systems.forEach(sys => this.add(sys));

          // 初始化组件
          this.executeSystemFlows.forEach(sys => sys.init());
        }
        execute(dt) {
          for (let i = 0; i < this.systemCnt; i++) {
            // @ts-ignore
            this.executeSystemFlows[i].execute(dt);
          }
        }
        clear() {
          this.executeSystemFlows.forEach(sys => sys.onDestroy());
        }
      }
      exports('ECSRootSystem', ECSRootSystem);

      /** 系统组合器，用于将多个相同功能模块的系统逻辑上放在一起，系统也可以嵌套系统 */
      class ECSSystem {
        constructor() {
          this._comblockSystems = [];
        }
        get comblockSystems() {
          return this._comblockSystems;
        }
        add(system) {
          if (system instanceof ECSSystem) {
            Array.prototype.push.apply(this._comblockSystems, system._comblockSystems);
            system._comblockSystems.length = 0;
          } else {
            this._comblockSystems.push(system);
          }
          return this;
        }
      }
      exports('ECSSystem', ECSSystem);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Effect2DFollow3D.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Oops.ts', './MathUtil.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component, Vec3, oops, MathUtil;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      MathUtil = module.MathUtil;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "f04f92UNY1J34UPA0VrEIsH", "Effect2DFollow3D", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 2D节点跟随3D节点 */
      let Effect2DFollow3D = exports('Effect2DFollow3D', (_dec = ccclass("Effect2DFollow3D"), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Node
      }), _dec(_class = (_class2 = class Effect2DFollow3D extends Component {
        constructor(...args) {
          super(...args);
          /** 3D世界节点 */
          _initializerDefineProperty(this, "node3d", _descriptor, this);
          /** 2D界面界面 */
          _initializerDefineProperty(this, "nodeUi", _descriptor2, this);
          /** 距离 */
          _initializerDefineProperty(this, "distance", _descriptor3, this);
          /** 3D摄像机 */
          this.camera = null;
          this.pos = new Vec3();
        }
        /**
         * 设3D定位参考点，并更新位置
         * @param node 3D世界节点
         */
        setTarget(node) {
          this.node3d = node;
        }
        start() {
          var scale = this.zoom();
          this.node.setScale(scale, scale, 1);
        }
        lateUpdate(dt) {
          var scale = this.zoom();
          scale = MathUtil.lerp(this.node.scale.x, scale, 0.1);
          this.node.setScale(scale, scale, 1);
        }
        zoom() {
          this.camera.convertToUINode(this.node3d.worldPosition, oops.gui.game, this.pos);
          this.nodeUi.setPosition(this.pos);

          // @ts-ignore
          Vec3.transformMat4(this.pos, this.node3d.worldPosition, this.camera._camera.matView);
          var ratio = this.distance / Math.abs(this.pos.z);
          var value = Math.floor(ratio * 100) / 100;
          return value;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "node3d", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "nodeUi", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "distance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EffectDelayRelease.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './EffectSingleCase.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Component, EffectSingleCase;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      EffectSingleCase = module.EffectSingleCase;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "01359fvxlFJZKx7BLUcTSWS", "EffectDelayRelease", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 延时释放特效 */
      let EffectDelayRelease = exports('EffectDelayRelease', (_dec = ccclass('EffectDelayRelease'), _dec(_class = (_class2 = class EffectDelayRelease extends Component {
        constructor(...args) {
          super(...args);
          /** 延时释放时间(单位秒) */
          _initializerDefineProperty(this, "delay", _descriptor, this);
        }
        onEnable() {
          this.scheduleOnce(this.onDelay, this.delay);
        }
        onDelay() {
          EffectSingleCase.instance.put(this.node);
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "delay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EffectEvent.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "445875CzyRKaLiSXTYH66lm", "EffectEvent", undefined);
      /** 特效管理模块事件 */
      let EffectEvent = exports('EffectEvent', /*#__PURE__*/function (EffectEvent) {
        EffectEvent["Put"] = "EffectEvent_Put";
        return EffectEvent;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EffectFinishedRelease.ts", ['cc', './Oops.ts', './EffectEvent.ts'], function (exports) {
  var cclegacy, Component, sp, Animation, ParticleSystem, _decorator, oops, EffectEvent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      sp = module.sp;
      Animation = module.Animation;
      ParticleSystem = module.ParticleSystem;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      EffectEvent = module.EffectEvent;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "a751fmayL5JMYH0D4uJoK5H", "EffectFinishedRelease", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 动画播放完释放特效 - Animation、ParticleSystem */
      let EffectFinishedRelease = exports('EffectFinishedRelease', (_dec = ccclass('EffectFinishedRelease'), _dec(_class = class EffectFinishedRelease extends Component {
        constructor(...args) {
          super(...args);
          /** 动画最大播放时间 */
          this.maxDuration = 0;
        }
        onEnable() {
          // SPINE动画
          let spine = this.getComponent(sp.Skeleton);
          if (spine) {
            // 播放第一个动画
            let json = spine.skeletonData.skeletonJson.animations;
            for (var name in json) {
              spine.setCompleteListener(this.onRecovery.bind(this));
              spine.setAnimation(0, name, false);
              break;
            }
          } else {
            // COCOS动画
            let anims = this.node.getComponentsInChildren(Animation);
            if (anims.length > 0) {
              anims.forEach(animator => {
                var _animator$defaultClip;
                let aniName = (_animator$defaultClip = animator.defaultClip) == null ? void 0 : _animator$defaultClip.name;
                if (aniName) {
                  let aniState = animator.getState(aniName);
                  if (aniState) {
                    let duration = aniState.duration;
                    this.maxDuration = duration > this.maxDuration ? duration : this.maxDuration;
                  }
                }
                animator.play();
              });
              this.scheduleOnce(this.onRecovery.bind(this), this.maxDuration);
            }
            // 粒子动画
            else if (ParticleSystem) {
              let particles = this.node.getComponentsInChildren(ParticleSystem);
              particles.forEach(particle => {
                particle.clear();
                particle.stop();
                particle.play();
                let duration = particle.duration;
                this.maxDuration = duration > this.maxDuration ? duration : this.maxDuration;
              });
              this.scheduleOnce(this.onRecovery.bind(this), this.maxDuration);
            }
          }
        }
        onRecovery() {
          if (this.node.parent) oops.message.dispatchEvent(EffectEvent.Put, this.node);
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EffectSingleCase.ts", ['cc', './Oops.ts', './ViewUtil.ts', './EffectEvent.ts', './EffectFinishedRelease.ts'], function (exports) {
  var cclegacy, Prefab, NodePool, sp, Animation, ParticleSystem, Component, oops, ViewUtil, EffectEvent, EffectFinishedRelease;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      NodePool = module.NodePool;
      sp = module.sp;
      Animation = module.Animation;
      ParticleSystem = module.ParticleSystem;
      Component = module.Component;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      ViewUtil = module.ViewUtil;
    }, function (module) {
      EffectEvent = module.EffectEvent;
    }, function (module) {
      EffectFinishedRelease = module.EffectFinishedRelease;
    }],
    execute: function () {
      cclegacy._RF.push({}, "bf338Z+oYxIUbd4bPREw9Ud", "EffectSingleCase", undefined);

      /** 效果数据 */
      class EffectData extends Component {
        constructor(...args) {
          super(...args);
          /** 资源路径 */
          this.path = null;
        }
      }

      /** 特效参数 */

      /** 
       * 动画特效对象池管理器，加载动画后自动播放，播放完后自动回收到池中
       * 1、支持Spine动画
       * 2、支持Cocos Animation动画
       * 3、支持Cocos ParticleSystem粒子动画
       */
      class EffectSingleCase {
        static get instance() {
          if (this._instance == null) {
            this._instance = new EffectSingleCase();
          }
          return this._instance;
        }
        /** 全局动画播放速度 */
        get speed() {
          return this._speed;
        }
        set speed(value) {
          this._speed = value;
          this.effects_use.forEach((value, key) => {
            this.setSpeed(key);
          });
        }

        /** 对象池集合 */

        constructor() {
          this._speed = 1;
          this.effects = new Map();
          /** 正在使用中的显示对象集合 */
          this.effects_use = new Map();
          /** 对象池中用到的资源 - 这里只管理本对象加载的资源，预加载资源由其它对象自己施放 */
          this.res = new Map();
          oops.message.on(EffectEvent.Put, this.onHandler, this);
        }
        onHandler(event, args) {
          if (event == EffectEvent.Put) {
            this.put(args);
          }
        }

        /** 
         * 加载资源并现实特效 
         * @param path    预制资源路径
         * @param parent  父节点
         * @param pos     位置
         */
        loadAndShow(path, parent, params) {
          return new Promise(async (resolve, reject) => {
            var np = this.effects.get(path);
            if (np == undefined) {
              // 记录显示对象资源
              this.res.set(path, true);
              oops.res.load(path, Prefab, (err, prefab) => {
                if (err) {
                  console.error(`名为【${path}】的特效资源加载失败`);
                  return;
                }
                var node = this.show(path, parent, params);
                resolve(node);
              });
            } else {
              var node = this.show(path, parent, params);
              resolve(node);
            }
          });
        }

        /** 
         * 显示预制对象
         * @param path    预制资源路径
         * @param parent  父节点
         * @param pos     位置
         */
        show(path, parent, params) {
          var np = this.effects.get(path);
          if (np == null) {
            np = new NodePool();
            this.effects.set(path, np);
          }
          var node;
          // 创建池中新显示对象
          if (np.size() == 0) {
            node = ViewUtil.createPrefabNode(path);
            node.addComponent(EffectData).path = path;
            if (params && params.isPlayFinishedRelease) {
              node.addComponent(EffectFinishedRelease);
            }
          }
          // 池中获取没使用的显示对象
          else {
            node = np.get();
            node.getComponent(EffectFinishedRelease);
          }

          // 设置动画播放速度
          this.setSpeed(node);

          // 设置显示对象位置
          if (params && params.pos) node.position = params.pos;

          // 显示到屏幕上
          if (parent) node.parent = parent;

          // 记录缓冲池中放出的节点
          this.effects_use.set(node, true);
          return node;
        }

        /**
         * 回收对象
         * @param name  预制对象名称
         * @param node  节点
         */
        put(node) {
          var name = node.getComponent(EffectData).path;
          var np = this.effects.get(name);
          if (np) {
            // 回收使用的节点
            this.effects_use.delete(node);

            // 回到到池中
            np.put(node);
          }
        }

        /**
         * 清除对象池数据
         * @param path  参数为空时，清除所有对象池数据;指定名时，清楚指定数据
         */
        clear(path) {
          if (path) {
            var np = this.effects.get(path);
            np.clear();
          } else {
            this.effects.forEach(np => {
              np.clear();
            });
            this.effects.clear();
          }
        }

        /**
         * 施放对象池中显示对象的资源内存
         * @param path 资源路径 
         */
        release(path) {
          if (path) {
            this.clear(path);
            oops.res.release(path);
          } else {
            this.clear();
            this.res.forEach((value, path) => {
              oops.res.release(path);
            });
          }
        }

        /** 设置动画速度 */
        setSpeed(node) {
          // SPINE动画
          let spine = node.getComponent(sp.Skeleton);
          if (spine) {
            spine.timeScale = this.speed;
          } else {
            // COCOS动画
            let anims = node.getComponentsInChildren(Animation);
            if (anims.length > 0) {
              anims.forEach(animator => {
                var _animator$defaultClip;
                let aniName = (_animator$defaultClip = animator.defaultClip) == null ? void 0 : _animator$defaultClip.name;
                if (aniName) {
                  let aniState = animator.getState(aniName);
                  if (aniState) {
                    aniState.speed = this.speed;
                  }
                }
              });
            }
            // 粒子动画
            else if (ParticleSystem) {
              let particles = node.getComponentsInChildren(ParticleSystem);
              particles.forEach(particle => {
                particle.simulationSpeed = this.speed;
              });
            }
          }
        }
      }
      exports('EffectSingleCase', EffectSingleCase);
      EffectSingleCase._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EncryptUtil.ts", ['cc', './index.js'], function (exports) {
  var cclegacy, CryptoES;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      CryptoES = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "46d12Bx4JdKnIYHhcvNk6S1", "EncryptUtil", undefined);

      /** 
       * CryptoES 加密库封装 
       * https://github.com/entronad/crypto-es
       * 
       * 安装第三方库生效
       * npm install -g yarn
       * yarn add crypto-es
       */
      class EncryptUtil {
        /**
         * MD5加密
         * @param msg 加密信息
         */
        static md5(msg) {
          return CryptoES.MD5(msg).toString();
        }

        /** 初始化加密库 */
        static initCrypto(key, iv) {
          this.key = key;
          this.iv = CryptoES.enc.Hex.parse(iv);
        }

        /**
         * AES 加密
         * @param msg 加密信息
         * @param key aes加密的key 
         * @param iv  aes加密的iv
         */
        static aesEncrypt(msg, key, iv) {
          return CryptoES.AES.encrypt(msg, this.key, {
            iv: this.iv,
            format: this.JsonFormatter
          }).toString();
        }

        /**
         * AES 解密
         * @param str 解密字符串
         * @param key aes加密的key 
         * @param iv  aes加密的iv
         */
        static aesDecrypt(str, key, iv) {
          const decrypted = CryptoES.AES.decrypt(str, this.key, {
            iv: this.iv,
            format: this.JsonFormatter
          });
          return decrypted.toString(CryptoES.enc.Utf8);
        }
      }
      exports('EncryptUtil', EncryptUtil);
      EncryptUtil.key = null;
      EncryptUtil.iv = null;
      EncryptUtil.JsonFormatter = {
        stringify: function (cipherParams) {
          const jsonObj = {
            ct: cipherParams.ciphertext.toString(CryptoES.enc.Base64)
          };
          if (cipherParams.iv) {
            jsonObj.iv = cipherParams.iv.toString();
          }
          if (cipherParams.salt) {
            jsonObj.s = cipherParams.salt.toString();
          }
          return JSON.stringify(jsonObj);
        },
        parse: function (jsonStr) {
          const jsonObj = JSON.parse(jsonStr);
          const cipherParams = CryptoES.lib.CipherParams.create({
            ciphertext: CryptoES.enc.Base64.parse(jsonObj.ct)
          });
          if (jsonObj.iv) {
            cipherParams.iv = CryptoES.enc.Hex.parse(jsonObj.iv);
          }
          if (jsonObj.s) {
            cipherParams.salt = CryptoES.enc.Hex.parse(jsonObj.s);
          }
          return cipherParams;
        }
      };
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EventDispatcher.ts", ['cc', './MessageManager.ts'], function (exports) {
  var cclegacy, MessageEventData;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      MessageEventData = module.MessageEventData;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c680af5iPNKeIO4cArf/90m", "EventDispatcher", undefined);

      /* 事件对象基类，继承该类将拥有发送和接送事件的能力 */
      class EventDispatcher {
        constructor() {
          this._msg = null;
        }
        /**
         * 注册全局事件
         * @param event     事件名
         * @param listener  处理事件的侦听器函数
         * @param object    侦听函数绑定的作用域对象
         */
        on(event, listener, object) {
          if (this._msg == null) {
            this._msg = new MessageEventData();
          }
          this._msg.on(event, listener, object);
        }

        /**
         * 移除全局事件
         * @param event      事件名
         */
        off(event) {
          if (this._msg) {
            this._msg.off(event);
          }
        }

        /** 
         * 触发全局事件 
         * @param event      事件名
         * @param args       事件参数
         */
        dispatchEvent(event, args = null) {
          if (this._msg == null) {
            this._msg = new MessageEventData();
          }
          this._msg.dispatchEvent(event, args);
        }

        /**
         * 销毁事件对象
         */
        destroy() {
          if (this._msg) {
            this._msg.clear();
          }
          this._msg = null;
        }
      }
      exports('EventDispatcher', EventDispatcher);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EventMessage.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "beea7u9xnJD4rMj6ua/LTcF", "EventMessage", undefined);
      /*
       * @Author: dgflash
       * @Date: 2021-07-03 16:13:17
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-02 11:03:08
       */
      /**
       * 全局事件监听方法
       * @param event      事件名
       * @param args       事件参数
       */
      /** 框架内部全局事件  */
      let EventMessage = exports('EventMessage', /*#__PURE__*/function (EventMessage) {
        EventMessage["GAME_SHOW"] = "GAME_ENTER";
        EventMessage["GAME_HIDE"] = "GAME_EXIT";
        EventMessage["GAME_RESIZE"] = "GAME_RESIZE";
        EventMessage["GAME_FULL_SCREEN"] = "GAME_FULL_SCREEN";
        EventMessage["GAME_ORIENTATION"] = "GAME_ORIENTATION";
        return EventMessage;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/FlashSpine.ts", ['cc'], function (exports) {
  var cclegacy, Component, sp, Material, _decorator;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      sp = module.sp;
      Material = module.Material;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "61de7pPhiNF5plXR5pVKfXu", "FlashSpine", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let FlashSpine = exports('default', (_dec = ccclass('FlashSpine'), _dec(_class = class FlashSpine extends Component {
        constructor(...args) {
          super(...args);
          this.duration = 0.5;
          this._median = 0;
          this._time = 0;
          this._material = null;
          this._skeleton = null;
        }
        onLoad() {
          this._median = this.duration / 2;
          // 获取材质
          this._skeleton = this.node.getComponent(sp.Skeleton);
          this._material = this._skeleton.customMaterial;
          // 设置材质对应的属性
          this._material.setProperty("u_rate", 1);
        }
        update(dt) {
          if (this._time > 0) {
            this._time -= dt;
            this._time = this._time < 0 ? 0 : this._time;
            let rate = Math.abs(this._time - this._median) * 2 / this.duration;
            let mat = new Material();
            mat.copy(this._material);
            this._skeleton.customMaterial = mat;
            mat.setProperty("u_rate", rate);
          }
        }
        clickFlash() {
          this._time = this.duration;
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/FlashSprite.ts", ['cc'], function (exports) {
  var cclegacy, Component, Sprite, _decorator;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Sprite = module.Sprite;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "a7a9eXWbUpJ3rONqlgUYCY/", "FlashSprite", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let FlashSprite = exports('default', (_dec = ccclass('FlashSprite'), _dec(_class = class FlashSprite extends Component {
        constructor(...args) {
          super(...args);
          this.duration = 0.5;
          this._median = 0;
          this._time = 0;
          this._material = null;
        }
        onLoad() {
          this._median = this.duration / 2;
          // 获取材质
          this._material = this.node.getComponent(Sprite).getMaterial(0);
          // 设置材质对应的属性
          this._material.setProperty("u_rate", 1);
        }
        update(dt) {
          if (this._time > 0) {
            this._time -= dt;
            this._time = this._time < 0 ? 0 : this._time;
            let rate = Math.abs(this._time - this._median) * 2 / this.duration;
            this._material.setProperty("u_rate", rate);
          }
        }
        clickFlash() {
          this._time = this.duration;
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/FreeFlightCamera.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, KeyCode, CCFloat, _decorator, math, Component, input, Input, game;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      KeyCode = module.KeyCode;
      CCFloat = module.CCFloat;
      _decorator = module._decorator;
      math = module.math;
      Component = module.Component;
      input = module.input;
      Input = module.Input;
      game = module.game;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "6c841mU+4JNvqwHy5tJsJh0", "FreeFlightCamera", undefined);
      const {
        ccclass,
        property,
        menu
      } = _decorator;
      const {
        Vec2,
        Vec3,
        Quat
      } = math;
      const v2_1 = new Vec2();
      const v2_2 = new Vec2();
      const v3_1 = new Vec3();
      const qt_1 = new Quat();
      const KEYCODE = {
        W: 'W'.charCodeAt(0),
        S: 'S'.charCodeAt(0),
        A: 'A'.charCodeAt(0),
        D: 'D'.charCodeAt(0),
        Q: 'Q'.charCodeAt(0),
        E: 'E'.charCodeAt(0),
        SHIFT: KeyCode.SHIFT_LEFT
      };
      let FreeFlightCamera = exports('FreeFlightCamera', (_dec = ccclass("FreeFlightCamera"), _dec2 = menu('oops/camera/FreeFlightCamera'), _dec3 = property({
        type: CCFloat,
        tooltip: "移动速度"
      }), _dec4 = property({
        type: CCFloat,
        tooltip: "按Shift键后的速度"
      }), _dec5 = property({
        type: CCFloat,
        slide: true,
        range: [0.05, 0.5, 0.01],
        tooltip: "移动后惯性效果"
      }), _dec6 = property({
        type: CCFloat,
        tooltip: "旋转速度"
      }), _dec(_class = _dec2(_class = (_class2 = class FreeFlightCamera extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "moveSpeed", _descriptor, this);
          _initializerDefineProperty(this, "moveSpeedShiftScale", _descriptor2, this);
          _initializerDefineProperty(this, "damp", _descriptor3, this);
          _initializerDefineProperty(this, "rotateSpeed", _descriptor4, this);
          this._euler = new Vec3();
          this._velocity = new Vec3();
          this._position = new Vec3();
          this._speedScale = 1;
        }
        onLoad() {
          input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
          input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          Vec3.copy(this._euler, this.node.eulerAngles);
          Vec3.copy(this._position, this.node.position);
        }
        onDestroy() {
          input.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
          input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        update(dt) {
          // position
          Vec3.transformQuat(v3_1, this._velocity, this.node.rotation);
          Vec3.scaleAndAdd(this._position, this._position, v3_1, this.moveSpeed * this._speedScale);
          Vec3.lerp(v3_1, this.node.position, this._position, dt / this.damp); // 向量线性插值产生位移惯性效果
          this.node.setPosition(v3_1);

          // rotation
          Quat.fromEuler(qt_1, this._euler.x, this._euler.y, this._euler.z);
          Quat.slerp(qt_1, this.node.rotation, qt_1, dt / this.damp); // 四元素线性插值产生旋转惯性效果
          this.node.setRotation(qt_1);
        }
        onMouseWheel(event) {
          const delta = -event.getScrollY() * this.moveSpeed * 0.1; // 向下滚动时增量为正
          Vec3.transformQuat(v3_1, Vec3.UNIT_Z, this.node.rotation);
          Vec3.scaleAndAdd(this._position, this.node.position, v3_1, delta);
        }
        onKeyDown(event) {
          const v = this._velocity;
          if (event.keyCode === KEYCODE.SHIFT) {
            this._speedScale = this.moveSpeedShiftScale;
          } else if (event.keyCode === KEYCODE.W) {
            if (v.z === 0) {
              v.z = -1;
            }
          } else if (event.keyCode === KEYCODE.S) {
            if (v.z === 0) {
              v.z = 1;
            }
          } else if (event.keyCode === KEYCODE.A) {
            if (v.x === 0) {
              v.x = -1;
            }
          } else if (event.keyCode === KEYCODE.D) {
            if (v.x === 0) {
              v.x = 1;
            }
          } else if (event.keyCode === KEYCODE.Q) {
            if (v.y === 0) {
              v.y = -1;
            }
          } else if (event.keyCode === KEYCODE.E) {
            if (v.y === 0) {
              v.y = 1;
            }
          }
        }
        onKeyUp(event) {
          const v = this._velocity;
          if (event.keyCode === KEYCODE.SHIFT) {
            this._speedScale = 1;
          } else if (event.keyCode === KEYCODE.W) {
            if (v.z < 0) {
              v.z = 0;
            }
          } else if (event.keyCode === KEYCODE.S) {
            if (v.z > 0) {
              v.z = 0;
            }
          } else if (event.keyCode === KEYCODE.A) {
            if (v.x < 0) {
              v.x = 0;
            }
          } else if (event.keyCode === KEYCODE.D) {
            if (v.x > 0) {
              v.x = 0;
            }
          } else if (event.keyCode === KEYCODE.Q) {
            if (v.y < 0) {
              v.y = 0;
            }
          } else if (event.keyCode === KEYCODE.E) {
            if (v.y > 0) {
              v.y = 0;
            }
          }
        }
        onTouchStart(e) {
          game.canvas.requestPointerLock();
        }
        onTouchMove(e) {
          e.getStartLocation(v2_1);
          if (v2_1.x > game.canvas.width * 0.4) {
            // rotation
            e.getDelta(v2_2);
            this._euler.y -= v2_2.x * this.rotateSpeed * 0.1; // 上下旋转
            this._euler.x += v2_2.y * this.rotateSpeed * 0.1; // 左右旋转
          } else {
            // position
            e.getLocation(v2_2);
            Vec2.subtract(v2_2, v2_2, v2_1);
            this._velocity.x = v2_2.x * 0.01;
            this._velocity.z = -v2_2.y * 0.01;
          }
        }
        onTouchEnd(e) {
          if (document.exitPointerLock) {
            document.exitPointerLock();
          }
          e.getStartLocation(v2_1);
          if (v2_1.x < game.canvas.width * 0.4) {
            // position
            this._velocity.x = 0;
            this._velocity.z = 0;
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeedShiftScale", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "damp", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "rotateSpeed", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      })), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameCollision.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ccenum, _decorator, Component, Collider;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      ccenum = module.ccenum;
      _decorator = module._decorator;
      Component = module.Component;
      Collider = module.Collider;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "7fa3eqzDkpBUq8OUNr05VJh", "GameCollision", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 碰撞物体类型 */
      let CollisionType = exports('CollisionType', /*#__PURE__*/function (CollisionType) {
        CollisionType[CollisionType["Role"] = 0] = "Role";
        CollisionType[CollisionType["Ballistic"] = 1] = "Ballistic";
        CollisionType[CollisionType["Wall"] = 2] = "Wall";
        return CollisionType;
      }({}));
      ccenum(CollisionType);

      /** 碰撞器与触发器 */
      let GameCollision = exports('GameCollision', (_dec = ccclass('GameCollision'), _dec2 = property({
        type: CollisionType,
        tooltip: '碰撞物体类型'
      }), _dec(_class = (_class2 = class GameCollision extends Component {
        constructor(...args) {
          super(...args);
          this.Event_TriggerEnter = "onTriggerEnter";
          this.Event_TriggerStay = "onTriggerStay";
          this.Event_TriggerExit = "onTriggerExit";
          this.Event_CollisionEnter = "onCollisionEnter";
          this.Event_CollisionStay = "onCollisionStay";
          this.Event_CollisionExit = "onCollisionExit";
          this.collider = null;
          _initializerDefineProperty(this, "type", _descriptor, this);
        }
        onLoad() {
          this.collider = this.getComponent(Collider);
          if (this.collider.isTrigger) {
            this.collider.on(this.Event_TriggerEnter, this.onTrigger, this);
            this.collider.on(this.Event_TriggerStay, this.onTrigger, this);
            this.collider.on(this.Event_TriggerExit, this.onTrigger, this);
          } else {
            this.collider.on(this.Event_CollisionEnter, this.onCollision, this);
            this.collider.on(this.Event_CollisionStay, this.onCollision, this);
            this.collider.on(this.Event_CollisionExit, this.onCollision, this);
          }
        }
        onTrigger(event) {
          switch (event.type) {
            case this.Event_TriggerEnter:
              this.onTriggerEnter(event);
              break;
            case this.Event_TriggerStay:
              this.onTriggerStay(event);
              break;
            case this.Event_TriggerExit:
              this.onTriggerExit(event);
              break;
          }
        }
        onTriggerEnter(event) {}
        onTriggerStay(event) {}
        onTriggerExit(event) {}
        onCollision(event) {
          switch (event.type) {
            case this.Event_CollisionEnter:
              this.onCollisionEnter(event);
              break;
            case this.Event_CollisionStay:
              this.onCollisionStay(event);
              break;
            case this.Event_CollisionExit:
              this.onCollisionExit(event);
              break;
          }
        }
        onCollisionEnter(event) {}
        onCollisionStay(event) {}
        onCollisionExit(event) {}
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return CollisionType.Ballistic;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameComponent.ts", ['cc', './Oops.ts', './EventDispatcher.ts', './EventMessage.ts', './ViewUtil.ts', './ButtonTouchLong.ts'], function (exports) {
  var cclegacy, Component, Node, Button, input, Input, _decorator, oops, EventDispatcher, EventMessage, ViewUtil, ButtonTouchLong;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Node = module.Node;
      Button = module.Button;
      input = module.input;
      Input = module.Input;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      EventDispatcher = module.EventDispatcher;
    }, function (module) {
      EventMessage = module.EventMessage;
    }, function (module) {
      ViewUtil = module.ViewUtil;
    }, function (module) {
      ButtonTouchLong = module.ButtonTouchLong;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "62362nWbWZP653j6XL/zJDq", "GameComponent", undefined);
      const {
        ccclass
      } = _decorator;

      /** 
       * 游戏显示对象组件模板
       * 1、当前对象加载的资源，会在对象释放时，自动释放引用的资源
       * 2、当前对象支持启动游戏引擎提供的各种常用逻辑事件
       */
      let GameComponent = exports('GameComponent', (_dec = ccclass("GameComponent"), _dec(_class = class GameComponent extends Component {
        constructor(...args) {
          super(...args);
          //#region 全局事件管理
          this._event = null;
          //#endregion
          //#region 预制节点管理
          /** 摊平的节点集合（不能重名） */
          this.nodes = new Map();
          //#endregion
          //#region 资源加载管理
          /** 资源路径 */
          this.resPaths = new Map();
          // 游戏资源
          this.resPathsDir = new Map();
          // 游戏资源文件夹
          this.resPathsAudioEffect = new Map();
        }
        /** 全局事件管理器 */
        get event() {
          if (this._event == null) this._event = new EventDispatcher();
          return this._event;
        }

        /**
         * 注册全局事件
         * @param event       事件名
         * @param listener    处理事件的侦听器函数
         * @param object      侦听函数绑定的this对象
         */
        on(event, listener, object) {
          this.event.on(event, listener, object);
        }

        /**
         * 移除全局事件
         * @param event      事件名
         */
        off(event) {
          this.event.off(event);
        }

        /** 
         * 触发全局事件 
         * @param event      事件名
         * @param args       事件参数
         */
        dispatchEvent(event, args = null) {
          this.event.dispatchEvent(event, args);
        }
        /** 通过节点名获取预制上的节点，整个预制不能有重名节点 */
        getNode(name) {
          return this.nodes.get(name);
        }

        /** 平摊所有节点存到Map<string, Node>中通过get(name: string)方法获取 */
        nodeTreeInfoLite() {
          ViewUtil.nodeTreeInfoLite(this.node, this.nodes);
        }
        // 音效类资源
        /**
         * 获取资源
         * @param path          资源路径
         * @param type          资源类型
         * @param bundleName    远程资源包名
         */
        getRes(path, type, bundleName) {
          return oops.res.get(path, type, bundleName);
        }

        /** 异步加载资源 */

        loadAsync(bundleName, paths, type) {
          if (paths instanceof Array) {
            paths.forEach(path => {
              this.resPaths.set(path, oops.res.defaultBundleName);
            });
          } else {
            this.resPaths.set(bundleName, oops.res.defaultBundleName);
          }
          return oops.res.loadAsync(bundleName, paths, type);
        }

        /** 加载资源 */

        load(bundleName, paths, type, onProgress, onComplete) {
          if (paths instanceof Array) {
            paths.forEach(path => {
              this.resPaths.set(path, oops.res.defaultBundleName);
            });
          } else {
            this.resPaths.set(bundleName, oops.res.defaultBundleName);
          }
          oops.res.load(bundleName, paths, type, onProgress, onComplete);
        }

        /** 加载文件名中资源 */

        loadDir(bundleName, dir, type, onProgress, onComplete) {
          if (typeof dir === "string") {
            this.resPathsDir.set(dir, oops.res.defaultBundleName);
          } else {
            this.resPathsDir.set(bundleName, oops.res.defaultBundleName);
          }
          oops.res.loadDir(bundleName, dir, type, onProgress, onComplete);
        }

        /** 释放一个资源 */
        release() {
          this.resPaths.forEach((value, key) => {
            oops.res.release(key, value);
          });
          this.resPaths.clear();
          this.resPaths = null;
        }

        /** 释放一个文件夹的资源 */
        releaseDir() {
          this.resPathsDir.forEach((value, key) => {
            oops.res.releaseDir(key, value);
          });
          this.resPathsDir.clear();
          this.resPathsDir = null;
        }

        /** 释放音效资源 */
        releaseAudioEffect() {
          this.resPathsAudioEffect.forEach((value, key) => {
            oops.audio.effect.release(key);
          });
          this.resPathsAudioEffect.clear();
          this.resPathsAudioEffect = null;
        }
        //#endregion

        //#region 音频播放管理
        /**
         * 播放背景音乐
         * @param url       资源地址
         */
        playMusic(url) {
          oops.audio.playMusic(url);
        }

        /**
         * 循环播放背景音乐
         * @param url        资源地址
         */
        playMusicLoop(url) {
          oops.audio.stopMusic();
          oops.audio.playMusicLoop(url);
        }

        /**
        * 播放音效
        * @param url        资源地址
        */
        playEffect(url) {
          this.resPathsAudioEffect.set(url, oops.res.defaultBundleName);
          oops.audio.playEffect(url);
        }
        //#endregion

        //#region 游戏逻辑事件
        /** 
         * 批量设置当前界面按钮事件
         * @example
         * 注：按钮节点Label1、Label2必须绑定ButtonSimple、ButtonEffect等类型的按钮组件才会生效，方法名必须与节点名一致
         * this.setButton("Label1", "Label2");
         * 
         * Label1(event: EventTouch) { console.log(event.target.name); }
         * Label2(event: EventTouch) { console.log(event.target.name); }
         */
        setButton(...args) {
          this.setButtonList(args);
        }
        setButtonList(args) {
          // 自定义按钮批量绑定触摸事件
          this.node.on(Node.EventType.TOUCH_END, event => {
            var self = this;
            var func = self[event.target.name];
            if (func) {
              func.call(this, event);
            }
            // 不触发界面根节点触摸事件、不触发长按钮组件的触摸事件
            else if (event.target != this.node && event.target.getComponent(ButtonTouchLong) == null) {
              console.error(`名为【${event.target.name}】的按钮事件方法不存在`);
            }
          }, this);

          // Cocos Creator Button组件批量绑定触摸事件
          var buttons = this.node.getComponentsInChildren(Button);
          buttons.forEach(b => {
            var node = b.node;
            var self = this;
            var func = self[node.name];
            if (func) {
              node.on(Node.EventType.TOUCH_END, func, this);
            } else console.error(`名为【${node.name}】的按钮事件方法不存在`);
          });
        }

        /** 
         * 批量设置全局事件 
         * @example
         *  this.setEvent("onGlobal");
         *  this.dispatchEvent("onGlobal", "全局事件");
         * 
         *  onGlobal(event: string, args: any) { console.log(args) };
         */
        setEvent(...args) {
          this.setEventList(args);
        }
        setEventList(args) {
          var self = this;
          for (const name of args) {
            var func = self[name];
            if (func) this.on(name, self[name], this);else console.error(`名为【${name}】的全局事方法不存在`);
          }
        }

        /**
         * 键盘事件开关
         * @param on 打开键盘事件为true
         */
        setKeyboard(on) {
          if (on) {
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
            input.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
          } else {
            input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
            input.off(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
          }
        }

        /** 键按下 */
        onKeyDown(event) {}

        /** 键放开 */
        onKeyUp(event) {}

        /** 键长按 */
        onKeyPressing(event) {}

        /** 监听游戏从后台进入事件 */
        setGameShow() {
          this.on(EventMessage.GAME_SHOW, this.onGameShow, this);
        }

        /** 监听游戏切到后台事件 */
        setGameHide() {
          this.on(EventMessage.GAME_HIDE, this.onGameHide, this);
        }

        /** 监听游戏画笔尺寸变化事件 */
        setGameResize() {
          this.on(EventMessage.GAME_RESIZE, this.onGameResize, this);
        }

        /** 监听游戏全屏事件 */
        setGameFullScreen() {
          this.on(EventMessage.GAME_FULL_SCREEN, this.onGameFullScreen, this);
        }

        /** 监听游戏旋转屏幕事件 */
        setGameOrientation() {
          this.on(EventMessage.GAME_ORIENTATION, this.onGameOrientation, this);
        }

        /** 游戏从后台进入事件回调 */
        onGameShow() {}

        /** 游戏切到后台事件回调 */
        onGameHide() {}

        /** 游戏画笔尺寸变化事件回调 */
        onGameResize() {}

        /** 游戏全屏事件回调 */
        onGameFullScreen() {}

        /** 游戏旋转屏幕事件回调 */
        onGameOrientation() {}
        //#endregion

        onDestroy() {
          // 释放消息对象
          if (this._event) {
            this._event.destroy();
            this._event = null;
          }

          // 节点引用数据清除
          this.nodes.clear();

          // 自动释放资源
          this.releaseAudioEffect();
          this.release();
          this.releaseDir();
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameConfig.ts", ['cc', './Oops.ts'], function (exports) {
  var cclegacy, oops;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      oops = module.oops;
    }],
    execute: function () {
      cclegacy._RF.push({}, "54585zBsmtGfZEDczLG3SH5", "GameConfig", undefined);

      /* 游戏配置解析，对应 resources/config/config.json 配置 */
      class GameConfig {
        /** 客户端版本号配置 */
        get version() {
          return this._data["config"]["version"];
        }
        /** 包名 */
        get package() {
          return this._data["config"]["package"];
        }
        /** 游戏每秒传输帧数 */
        get frameRate() {
          return this._data.config.frameRate;
        }
        /** 本地存储内容加密 key */
        get localDataKey() {
          return this._data.config.localDataKey;
        }
        /** 本地存储内容加密 iv */
        get localDataIv() {
          return this._data.config.localDataIv;
        }
        /** Http 服务器地址 */
        get httpServer() {
          return this._data.config.httpServer;
        }
        /** Http 请求超时时间 */
        get httpTimeout() {
          return this._data.config.httpTimeout;
        }

        /** 获取当前客户端支持的语言类型 */
        get language() {
          return this._data.language.type || ["zh"];
        }
        /** 获取当前客户端支持的语言 Json 配置路径 */
        get languagePathJson() {
          return this._data.language.path.json || "language/json";
        }
        /** 获取当前客户端支持的语言纹理配置路径 */
        get languagePathTexture() {
          return this._data.language.path.texture || "language/texture";
        }

        /** 是否启用远程资源 */
        get bundleEnable() {
          return this._data.bundle.enable;
        }
        /** 远程资源服务器地址 */
        get bundleServer() {
          return this._data.bundle.server;
        }
        /** 远程资源名 */
        get bundleName() {
          return this._data.bundle.name;
        }
        /** 远程资源版本号 */
        get bundleVersion() {
          return this._data.bundle.version;
        }
        /** 游戏配置数据 */
        get data() {
          return this._data;
        }
        constructor(config) {
          this._data = null;
          let data = config.json;
          this._data = Object.freeze(data);
          oops.log.logConfig(this._data, "游戏配置");
        }
      }
      exports('GameConfig', GameConfig);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameEvent.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "28ac0rWU79HGpJWrnyK01Gn", "GameEvent", undefined);
      /*
       * @Author: dgflash
       * @Date: 2021-11-23 15:28:39
       * @LastEditors: dgflash
       * @LastEditTime: 2022-01-26 16:42:00
       */

      /** 游戏事件 */
      let GameEvent = exports('GameEvent', /*#__PURE__*/function (GameEvent) {
        GameEvent["GameServerConnected"] = "GameServerConnected";
        GameEvent["LoginSuccess"] = "LoginSuccess";
        return GameEvent;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameManager.ts", ['cc'], function (exports) {
  var cclegacy, director;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
    }],
    execute: function () {
      cclegacy._RF.push({}, "73fa0CEfOhMdJUoZwoFIIZV", "GameManager", undefined);

      /** 游戏世界管理 */
      class GameManager {
        constructor(root) {
          /** 界面根节点 */
          this.root = void 0;
          this.root = root;
        }

        /** 设置游戏动画速度 */
        setTimeScale(scale) {
          director.globalGameTimeScale = scale;
        }
        /** 获取游戏动画速度 */
        getTimeScale() {
          return director.globalGameTimeScale;
        }
      }
      exports('GameManager', GameManager);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameQueryConfig.ts", ['cc', './Oops.ts', './StringUtil.ts'], function (exports) {
  var cclegacy, sys, oops, StringUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      StringUtil = module.StringUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d09acUxcU5Hg4kUjKxVEWLy", "GameQueryConfig", undefined);

      /**
       * 获取和处理浏览器地址栏参数
       * @example
       * config.query.data.username
       */
      class GameQueryConfig {
        /** 调试模式开关 */
        get debug() {
          return this._data["debug"];
        }

        /** 玩家帐号名 */
        get username() {
          return this._data["username"];
        }

        /** 语言 */
        get lang() {
          return this._data["lang"] || "zh";
        }
        /** 浏览器地址栏原始参数 */
        get data() {
          return this._data;
        }

        /** 构造函数 */
        constructor() {
          this._data = null;
          if (!sys.isBrowser) {
            this._data = {};
            return;
          }
          this._data = this.parseUrl();
          if (!this._data["username"]) {
            this._data["username"] = StringUtil.guid();
          }
          oops.log.logConfig(this._data, "查询参数");
        }
        parseUrl() {
          if (typeof window !== "object") return {};
          if (!window.document) return {};
          let url = window.document.location.href.toString();
          let u = url.split("?");
          if (typeof u[1] == "string") {
            u = u[1].split("&");
            let get = {};
            for (let i = 0, l = u.length; i < l; ++i) {
              let j = u[i];
              let x = j.indexOf("=");
              if (x < 0) {
                continue;
              }
              let key = j.substring(0, x);
              let value = j.substring(x + 1);
              get[decodeURIComponent(key)] = value && decodeURIComponent(value);
            }
            return get;
          } else {
            return {};
          }
        }
      }
      exports('GameQueryConfig', GameQueryConfig);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameResPath.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "da7c04REk1B3ISEN54JyYG1", "GameResPath", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-08-05 17:05:23
       * @LastEditors: dgflash
       * @LastEditTime: 2022-08-05 17:05:52
       */

      /** 游戏资源路径 */
      class GameResPath {
        /** 游戏配置路径 */
        static getConfigPath(relative_path) {
          return "config/game/" + relative_path;
        }

        /** 角色资源路径 */
        static getRolePath(name) {
          return `content/role/${name}`;
        }
      }
      exports('GameResPath', GameResPath);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameUIConfig.ts", ['cc', './LayerManager.ts'], function (exports) {
  var cclegacy, LayerType;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      LayerType = module.LayerType;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ffa5c27PYVCvoC7Y7YOyl/8", "GameUIConfig", undefined);

      /** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
      let UIID = exports('UIID', /*#__PURE__*/function (UIID) {
        UIID[UIID["Loading"] = 1] = "Loading";
        UIID[UIID["Window"] = 2] = "Window";
        UIID[UIID["Netinstable"] = 3] = "Netinstable";
        UIID[UIID["Demo"] = 4] = "Demo";
        UIID[UIID["Demo_Role_Info"] = 5] = "Demo_Role_Info";
        UIID[UIID["MainUI"] = 6] = "MainUI";
        UIID[UIID["MainUI_Switch"] = 7] = "MainUI_Switch";
        UIID[UIID["Pop1"] = 8] = "Pop1";
        UIID[UIID["Pop2"] = 9] = "Pop2";
        UIID[UIID["Dialog"] = 10] = "Dialog";
        return UIID;
      }({}));

      /** 打开界面方式的配置数据 */
      var UIConfigData = exports('UIConfigData', {
        [UIID.Loading]: {
          layer: LayerType.UI,
          prefab: "loading/prefab/loading",
          bundle: "resources"
        },
        [UIID.Netinstable]: {
          layer: LayerType.PopUp,
          prefab: "common/prefab/netinstable"
        },
        [UIID.Window]: {
          layer: LayerType.Dialog,
          prefab: "common/prefab/window"
        },
        [UIID.Demo]: {
          layer: LayerType.UI,
          prefab: "gui/prefab/demo"
        },
        [UIID.Demo_Role_Info]: {
          layer: LayerType.UI,
          prefab: "gui/prefab/role_info"
        },
        [UIID.MainUI]: {
          layer: LayerType.UI,
          prefab: "demo/MainUI"
        },
        [UIID.MainUI_Switch]: {
          layer: LayerType.UI,
          prefab: "demo/MainUI_Switch"
        },
        [UIID.Pop1]: {
          layer: LayerType.PopUp,
          prefab: "demo/Pop1"
        },
        [UIID.Pop2]: {
          layer: LayerType.PopUp,
          prefab: "demo/Pop2"
        },
        [UIID.Dialog]: {
          layer: LayerType.Dialog,
          prefab: "demo/Dialog"
        }
      });
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GUI.ts", ['cc', './Oops.ts'], function (exports) {
  var cclegacy, Component, UITransform, view, math, screen, ResolutionPolicy, _decorator, oops;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      UITransform = module.UITransform;
      view = module.view;
      math = module.math;
      screen = module.screen;
      ResolutionPolicy = module.ResolutionPolicy;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "9461cd/dGNEGK5I5J24xY6L", "GUI", undefined);
      const {
        ccclass
      } = _decorator;

      /** 游戏界面屏幕自适应管理 */
      let GUI = exports('GUI', (_dec = ccclass('GUI'), _dec(_class = class GUI extends Component {
        constructor(...args) {
          super(...args);
          /** 是否为竖屏显示 */
          this.portrait = void 0;
          /** 竖屏设计尺寸 */
          this.portraitDrz = null;
          /** 横屏设计尺寸 */
          this.landscapeDrz = null;
          /** 界面层矩形信息组件 */
          this.transform = null;
        }
        onLoad() {
          this.init();
        }

        /** 初始化引擎 */
        init() {
          this.transform = this.getComponent(UITransform);
          if (view.getDesignResolutionSize().width > view.getDesignResolutionSize().height) {
            this.landscapeDrz = view.getDesignResolutionSize();
            this.portraitDrz = new math.Size(this.landscapeDrz.height, this.landscapeDrz.width);
          } else {
            this.portraitDrz = view.getDesignResolutionSize();
            this.landscapeDrz = new math.Size(this.portraitDrz.height, this.portraitDrz.width);
          }
          this.resize();
        }

        /** 游戏画布尺寸变化 */
        resize() {
          var dr;
          if (view.getDesignResolutionSize().width > view.getDesignResolutionSize().height) {
            dr = this.landscapeDrz;
          } else {
            dr = this.portraitDrz;
          }
          var s = screen.windowSize;
          var rw = s.width;
          var rh = s.height;
          var finalW = rw;
          var finalH = rh;
          if (rw / rh > dr.width / dr.height) {
            // 如果更长，则用定高
            finalH = dr.height;
            finalW = finalH * rw / rh;
            this.portrait = false;
          } else {
            // 如果更短，则用定宽
            finalW = dr.width;
            finalH = finalW * rh / rw;
            this.portrait = true;
          }

          // 通过设置设计分辨率和匹配模式来进行游戏画面的屏幕适配
          view.setDesignResolutionSize(finalW, finalH, ResolutionPolicy.UNKNOWN);
          this.transform.width = finalW;
          this.transform.height = finalH;
          oops.log.logView(dr, "设计尺寸");
          oops.log.logView(s, "屏幕尺寸");
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Hot.ts", ['cc', './Oops.ts'], function (exports) {
  var cclegacy, log, sys, error, native, oops;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      log = module.log;
      sys = module.sys;
      error = module.error;
      native = module.native;
    }, function (module) {
      oops = module.oops;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f6377Ckbb9Cg5R2ygFWMOCv", "Hot", undefined);

      /** 热更参数 */
      class HotOptions {
        constructor() {
          /** 获取到版本号信息 */
          this.onVersionInfo = null;
          /** 发现新版本，请更新 */
          this.onNeedToUpdate = null;
          /** 和远程版本一致，无须更新 */
          this.onNoNeedToUpdate = null;
          /** 更新失败 */
          this.onUpdateFailed = null;
          /** 更新完成 */
          this.onUpdateSucceed = null;
          /** 更新进度 */
          this.onUpdateProgress = null;
        }
        check() {
          for (let key in this) {
            if (key !== 'check') {
              if (!this[key]) {
                log(`参数HotOptions.${key}未设置！`);
                return false;
              }
            }
          }
          return true;
        }
      }
      exports('HotOptions', HotOptions);

      /** 热更管理 */
      class Hot {
        constructor() {
          this.assetsMgr = null;
          this.options = null;
          this.state = Hot.State.None;
          this.storagePath = "";
          this.manifest = "";
        }
        /** 热更初始化 */
        init(opt) {
          if (!sys.isNative) {
            return;
          }
          if (!opt.check()) {
            return;
          }
          this.options = opt;
          if (this.assetsMgr) {
            return;
          }
          oops.res.load('project', (err, res) => {
            if (err) {
              error("【热更新界面】缺少热更新配置文件");
              return;
            }
            this.showSearchPath();
            this.manifest = res.nativeUrl;
            this.storagePath = `${native.fileUtils.getWritablePath()}oops_framework_remote`;
            this.assetsMgr = new native.AssetsManager(this.manifest, this.storagePath, (versionA, versionB) => {
              var _this$options;
              console.log("【热更新】客户端版本: " + versionA + ', 当前最新版本: ' + versionB);
              ((_this$options = this.options) == null ? void 0 : _this$options.onVersionInfo) && this.options.onVersionInfo({
                local: versionA,
                server: versionB
              });
              let vA = versionA.split('.');
              let vB = versionB.split('.');
              for (let i = 0; i < vA.length; ++i) {
                let a = parseInt(vA[i]);
                let b = parseInt(vB[i] || '0');
                if (a !== b) {
                  return a - b;
                }
              }
              if (vB.length > vA.length) {
                return -1;
              } else {
                return 0;
              }
            });

            // 设置验证回调，如果验证通过，则返回true，否则返回false
            this.assetsMgr.setVerifyCallback((path, asset) => {
              // 压缩资源时，我们不需要检查其md5，因为zip文件已被删除
              var compressed = asset.compressed;
              // 检索正确的md5值
              var expectedMD5 = asset.md5;
              // 资源路径是相对路径，路径是绝对路径
              var relativePath = asset.path;
              // 资源文件的大小，但此值可能不存在
              var size = asset.size;
              return true;
            });
            var localManifest = this.assetsMgr.getLocalManifest();
            console.log('【热更新】热更资源存放路径: ' + this.storagePath);
            console.log('【热更新】本地资源配置路径: ' + this.manifest);
            console.log('【热更新】本地包地址: ' + localManifest.getPackageUrl());
            console.log('【热更新】远程 project.manifest 地址: ' + localManifest.getManifestFileUrl());
            console.log('【热更新】远程 version.manifest 地址: ' + localManifest.getVersionFileUrl());
            this.checkUpdate();
          });
        }

        /** 删除热更所有存储文件 */
        clearHotUpdateStorage() {
          native.fileUtils.removeDirectory(this.storagePath);
        }

        // 检查更新
        checkUpdate() {
          console.log("检查更新");
          if (!this.assetsMgr) {
            console.log('【热更新】请先初始化');
            return;
          }
          if (this.assetsMgr.getState() === jsb.AssetsManager.State.UNINITED) {
            error('【热更新】未初始化');
            return;
          }
          if (!this.assetsMgr.getLocalManifest().isLoaded()) {
            console.log('【热更新】加载本地 manifest 失败 ...');
            return;
          }
          this.assetsMgr.setEventCallback(this.onHotUpdateCallBack.bind(this));
          this.state = Hot.State.Check;
          // 下载version.manifest，进行版本比对
          this.assetsMgr.checkUpdate();
        }

        /** 开始更热 */
        hotUpdate() {
          if (!this.assetsMgr) {
            console.log('【热更新】请先初始化');
            return;
          }
          this.assetsMgr.setEventCallback(this.onHotUpdateCallBack.bind(this));
          this.state = Hot.State.Update;
          this.assetsMgr.update();
        }
        onHotUpdateCallBack(event) {
          var _this$options2, _this$options3;
          let code = event.getEventCode();
          console.log("onHotUpdateCallBack", code);
          switch (code) {
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
              console.log("【热更新】当前版本与远程版本一致且无须更新");
              ((_this$options2 = this.options) == null ? void 0 : _this$options2.onNoNeedToUpdate) && this.options.onNoNeedToUpdate(code);
              break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
              console.log('【热更新】发现新版本,请更新');
              ((_this$options3 = this.options) == null ? void 0 : _this$options3.onNeedToUpdate) && this.options.onNeedToUpdate(code, this.assetsMgr.getTotalBytes());
              break;
            case native.EventAssetsManager.ASSET_UPDATED:
              console.log('【热更新】资产更新');
              break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
              if (this.state === Hot.State.Update) {
                var _this$options4;
                // event.getPercent();
                // event.getPercentByFile();
                // event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                console.log('【热更新】更新中...', event.getDownloadedFiles(), event.getTotalFiles(), event.getPercent());
                ((_this$options4 = this.options) == null ? void 0 : _this$options4.onUpdateProgress) && this.options.onUpdateProgress(event);
              }
              break;
            case native.EventAssetsManager.UPDATE_FINISHED:
              this.onUpdateFinished();
              break;
            default:
              this.onUpdateFailed(event);
              break;
          }
        }
        onUpdateFailed(event) {
          var _this$options5;
          console.log(event);
          this.assetsMgr.setEventCallback(null);
          ((_this$options5 = this.options) == null ? void 0 : _this$options5.onUpdateFailed) && this.options.onUpdateFailed(event.getEventCode());
        }
        onUpdateFinished() {
          var _this$options6;
          this.assetsMgr.setEventCallback(null);
          let searchPaths = native.fileUtils.getSearchPaths();
          let newPaths = this.assetsMgr.getLocalManifest().getSearchPaths();
          Array.prototype.unshift.apply(searchPaths, newPaths);
          localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
          native.fileUtils.setSearchPaths(searchPaths);
          console.log('【热更新】更新成功');
          ((_this$options6 = this.options) == null ? void 0 : _this$options6.onUpdateSucceed) && this.options.onUpdateSucceed();
        }
        showSearchPath() {
          console.log("========================搜索路径========================");
          let searchPaths = native.fileUtils.getSearchPaths();
          for (let i = 0; i < searchPaths.length; i++) {
            console.log("[" + i + "]: " + searchPaths[i]);
          }
          console.log("======================================================");
        }
      }
      exports('Hot', Hot);
      Hot.State = {
        None: 0,
        Check: 1,
        Update: 2
      };
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/HotUpdate.ts", ['cc', './Oops.ts', './GameUIConfig.ts', './TipsManager.ts', './Hot.ts', './LoadingViewComp.ts'], function (exports) {
  var cclegacy, Component, sys, game, _decorator, oops, UIID, tips, Hot, HotOptions, LoadingViewComp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      sys = module.sys;
      game = module.game;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      tips = module.tips;
    }, function (module) {
      Hot = module.Hot;
      HotOptions = module.HotOptions;
    }, function (module) {
      LoadingViewComp = module.LoadingViewComp;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "f64deiQLAhLh5HGqUqaI9oA", "HotUpdate", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 热更新界面控制脚本 */
      let HotUpdate = exports('HotUpdate', (_dec = ccclass('HotUpdate'), _dec(_class = class HotUpdate extends Component {
        constructor(...args) {
          super(...args);
          /** 热更新业务管理对象 */
          this.hot = new Hot();
          /** 公用加载界面UI做更新提示 */
          this.lv = null;
        }
        onLoad() {
          if (sys.isNative) {
            this.lv = this.getComponent(LoadingViewComp);
            this.lv.data.prompt = oops.language.getLangByID("update_tips_check_update");
            this.startHotUpdate();
          }
        }

        /** 开始热更新 */
        startHotUpdate() {
          let options = new HotOptions();
          options.onVersionInfo = data => {
            console.log(`【热更新界面】本地版本:${data.local},远程版本:${data.server}`);
          };
          options.onUpdateProgress = event => {
            // 进度提示字
            let pc = event.getPercent();
            let _total = event.getTotalBytes();
            let _have = event.getDownloadedBytes();
            let total, have;
            if (_total < 1048576) {
              // 小于1m，就显示kb
              _total = Math.ceil(_total / 1024);
              total = _total + 'K';
            } else {
              // 显示m
              total = (_total / (1024 * 1024)).toFixed(1);
              total = total + 'M';
            }
            if (_have < 1048576) {
              // 小于1m，就显示kb
              _have = Math.ceil(_have / 1024);
              have = _have + 'K';
            } else {
              // 显示m
              have = (_have / (1024 * 1024)).toFixed(1);
              have = have + 'M';
            }
            if (total == '0K') {
              this.lv.data.prompt = oops.language.getLangByID("update_tips_check_update");
            } else {
              this.lv.data.prompt = oops.language.getLangByID("update_tips_update") + have + '/' + total + ' (' + parseInt(pc * 100 + "") + '%)';
            }

            // 进度条
            if (!isNaN(event.getPercent())) {
              this.lv.data.finished = event.getDownloadedFiles();
              this.lv.data.total = event.getTotalFiles();
              this.lv.data.progress = (event.getPercent() * 100).toFixed(2);
            }
          };
          options.onNeedToUpdate = (data, totalBytes) => {
            this.lv.data.prompt = oops.language.getLangByID("update_tips_new_version");
            let total = "";
            if (totalBytes < 1048576) {
              // 小于1m，就显示kb
              // totalBytes = Math.ceil(totalBytes / 1024);
              // total = total + 'KB';
              total = Math.ceil(totalBytes / 1024) + 'KB';
            } else {
              total = (totalBytes / (1024 * 1024)).toFixed(1);
              total = total + 'MB';
            }

            // 提示更新
            this.checkForceUpdate(() => {
              // 非 WIFI 环境提示玩家
              this.showUpdateDialog(total, () => {
                this.hot.hotUpdate();
              });
            });
          };
          options.onNoNeedToUpdate = () => {
            this.lv.enter();
          };
          options.onUpdateFailed = () => {
            this.lv.data.prompt = oops.language.getLangByID("update_tips_update_fail");
            this.hot.checkUpdate();
          };
          options.onUpdateSucceed = () => {
            this.lv.data.progress = 100;
            this.lv.data.prompt = oops.language.getLangByID("update_tips_update_success");
            setTimeout(() => {
              game.restart();
            }, 1000);
          };
          this.hot.init(options);
        }

        /** 检查是否强制更新信息 */
        checkForceUpdate(callback) {
          let operate = {
            title: 'common_prompt_title_sys',
            content: "update_tips_force",
            okWord: 'common_prompt_ok',
            cancelWord: 'common_prompt_cancal',
            okFunc: () => {
              this.hot.clearHotUpdateStorage();
              callback();
            },
            cancelFunc: () => {
              game.end();
            },
            needCancel: true
          };
          oops.gui.open(UIID.Window, operate);
        }

        /** 非 WIFI 环境提示玩家 */
        showUpdateDialog(size, callback) {
          if (sys.getNetworkType() == sys.NetworkType.LAN) {
            callback();
            return;
          }
          tips.alert(oops.language.getLangByID("update_nowifi_tip") + size, callback);
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/HttpRequest.ts", ['cc'], function (exports) {
  var cclegacy, error, warn;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      error = module.error;
      warn = module.warn;
    }],
    execute: function () {
      cclegacy._RF.push({}, "806e5t8UetFy4spn89dnuan", "HttpRequest", undefined);

      /** 当前请求地址集合 */
      var urls = {};
      /** 请求参数 */
      var reqparams = {};
      /** 请求事件 */
      let HttpEvent = exports('HttpEvent', /*#__PURE__*/function (HttpEvent) {
        HttpEvent["NO_NETWORK"] = "http_request_no_network";
        HttpEvent["UNKNOWN_ERROR"] = "http_request_unknown_error";
        HttpEvent["TIMEOUT"] = "http_request_timout";
        return HttpEvent;
      }({}));

      /**
       * HTTP请求返回值
       */
      class HttpReturn {
        constructor() {
          /** 是否请求成功 */
          this.isSucc = false;
          /** 请求返回数据 */
          this.res = void 0;
          /** 请求错误数据 */
          this.err = void 0;
        }
      }
      exports('HttpReturn', HttpReturn);

      /** HTTP请求 */
      class HttpRequest {
        constructor() {
          /** 服务器地址 */
          this.server = "http://127.0.0.1/";
          /** 请求超时时间 */
          this.timeout = 10000;
          /** 自定义请求头信息 */
          this.header = new Map();
        }
        /**
         * 添加自定义请求头信息
         * @param name  信息名
         * @param value 信息值
         */
        addHeader(name, value) {
          this.header.set(name, value);
        }

        /**
         * HTTP GET请求
         * @param name                  协议名
         * @param onComplete            请求完整回调方法
         * @param params                查询参数
         * @example
        var param = '{"uid":12345}'
        var complete = (ret: HttpReturn) => {
            console.log(ret.res);
        }
        oops.http.getWithParams(name, complete, param);
         */
        get(name, onComplete, params = null) {
          this.sendRequest(name, params, false, onComplete);
        }

        /**
         * HTTP GET请求
         * @param name                  协议名
         * @param params                查询参数
         * @example 
        var txt = await oops.http.getAsync(name);
        if (txt.isSucc) {
            console.log(txt.res);
        }
         */
        getAsync(name, params = null) {
          return new Promise((resolve, reject) => {
            this.sendRequest(name, params, false, ret => {
              resolve(ret);
            });
          });
        }

        /**
         * HTTP GET请求非文本格式数据
         * @param name                  协议名
         * @param onComplete            请求完整回调方法
         * @param params                查询参数
         */
        getByArraybuffer(name, onComplete, params = null) {
          this.sendRequest(name, params, false, onComplete, 'arraybuffer', false);
        }

        /**
         * HTTP GET请求非文本格式数据
         * @param name                  协议名
         * @param params                查询参数
         * @returns Promise<any>
         */
        getAsyncByArraybuffer(name, params = null) {
          return new Promise((resolve, reject) => {
            this.sendRequest(name, params, false, ret => {
              resolve(ret);
            }, 'arraybuffer', false);
          });
        }

        /**
         * HTTP POST请求
         * @param name                  协议名
         * @param params                查询参数
         * @param onComplete      请求完整回调方法
         * @example
        var param = '{"LoginCode":"donggang_dev","Password":"e10adc3949ba59abbe56e057f20f883e"}'
        var complete = (ret: HttpReturn) => {
            console.log(ret.res);
        }
        oops.http.post(name, complete, param);
         */
        post(name, onComplete, params = null) {
          this.sendRequest(name, params, true, onComplete);
        }

        /**
         * HTTP POST请求
         * @param name                  协议名
         * @param params                查询参数
         */
        postAsync(name, params = null) {
          return new Promise((resolve, reject) => {
            this.sendRequest(name, params, true, ret => {
              resolve(ret);
            });
          });
        }

        /**
         * 取消请求中的请求
         * @param name     协议名
         */
        abort(name) {
          var xhr = urls[this.server + name];
          if (xhr) {
            xhr.abort();
          }
        }

        /**
         * 获得字符串形式的参数
         * @param params 参数对象
         * @returns 参数字符串
         */
        getParamString(params) {
          var result = "";
          for (var name in params) {
            let data = params[name];
            if (data instanceof Object) {
              for (var key in data) result += `${key}=${data[key]}&`;
            } else {
              result += `${name}=${data}&`;
            }
          }
          return result.substring(0, result.length - 1);
        }

        /** 
         * Http请求 
         * @param name(string)              请求地址
         * @param params(JSON)              请求参数
         * @param isPost(boolen)            是否为POST方式
         * @param callback(function)        请求成功回调
         * @param responseType(string)      响应类型
         * @param isOpenTimeout(boolean)    是否触发请求超时错误
         */
        sendRequest(name, params, isPost, onComplete, responseType, isOpenTimeout = true) {
          if (name == null || name == '') {
            error("请求地址不能为空");
            return;
          }
          var url,
            newUrl,
            paramsStr = "";
          if (name.toLocaleLowerCase().indexOf("http") == 0) {
            url = name;
          } else {
            url = this.server + name;
          }
          if (params) {
            paramsStr = this.getParamString(params);
            if (url.indexOf("?") > -1) newUrl = url + "&" + paramsStr;else newUrl = url + "?" + paramsStr;
          } else {
            newUrl = url;
          }
          if (urls[newUrl] != null && reqparams[newUrl] == paramsStr) {
            warn(`地址【${url}】已正在请求中，不能重复请求`);
            return;
          }
          var xhr = new XMLHttpRequest();

          // 防重复请求功能
          urls[newUrl] = xhr;
          reqparams[newUrl] = paramsStr;
          if (isPost) {
            xhr.open("POST", url);
          } else {
            xhr.open("GET", newUrl);
          }

          // 添加自定义请求头信息
          for (const [key, value] of this.header) {
            xhr.setRequestHeader(key, value);
          }
          // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
          // xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

          var data = {};
          data.url = url;
          data.params = params;

          // 请求超时
          if (isOpenTimeout) {
            xhr.timeout = this.timeout;
            xhr.ontimeout = () => {
              this.deleteCache(newUrl);
              ret.isSucc = false;
              ret.err = HttpEvent.TIMEOUT; // 超时
              onComplete(data);
            };
          }

          // 响应结果
          var ret = new HttpReturn();
          xhr.onloadend = () => {
            if (xhr.status == 500) {
              this.deleteCache(newUrl);
              ret.isSucc = false;
              ret.err = HttpEvent.NO_NETWORK; // 断网
              onComplete(ret);
            }
          };
          xhr.onerror = () => {
            this.deleteCache(newUrl);
            ret.isSucc = false;
            if (xhr.readyState == 0 || xhr.readyState == 1 || xhr.status == 0) {
              ret.err = HttpEvent.NO_NETWORK; // 断网
            } else {
              ret.err = HttpEvent.UNKNOWN_ERROR; // 未知错误
            }

            onComplete(ret);
          };
          xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;
            this.deleteCache(newUrl);
            if (xhr.status == 200 && onComplete) {
              ret.isSucc = true;
              if (responseType == 'arraybuffer') {
                xhr.responseType = responseType; // 加载非文本格式
                ret.res = xhr.response;
              } else {
                ret.res = JSON.parse(xhr.response);
              }
              onComplete(ret);
            }
          };

          // 发送请求
          if (params == null || params == "") {
            xhr.send();
          } else {
            xhr.send(paramsStr);
          }
        }
        deleteCache(url) {
          delete urls[url];
          delete reqparams[url];
        }
      }
      exports('HttpRequest', HttpRequest);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/IControl.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "58450TyE3JB069KO8P5+hl4", "IControl", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-06-21 12:05:14
       * @LastEditors: dgflash
       * @LastEditTime: 2022-07-20 14:04:27
       */
      /** 行为控制接口 */
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ImageUtil.ts", ['cc'], function (exports) {
  var cclegacy, Color, Texture2D;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Color = module.Color;
      Texture2D = module.Texture2D;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ebdf3rRnEdIYpKgGdW8gSmZ", "ImageUtil", undefined);

      /**
       * 图像工具
       */
      class ImageUtil {
        /**
         * 获取纹理中指定像素的颜色，原点为左上角，从像素 (1, 1) 开始。
         * @param texture 纹理
         * @param x x 坐标
         * @param y y 坐标
         * @example
        // 获取纹理左上角第一个像素的颜色
        const color = ImageUtil.getPixelColor(texture, 1, 1);
        cc.color(50, 100, 123, 255);
         */
        static getPixelColor(texture, x, y) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = texture.width;
          canvas.height = texture.height;
          const image = texture.getHtmlElementObj();
          ctx.drawImage(image, 0, 0, texture.width, texture.height);
          const imageData = ctx.getImageData(0, 0, texture.width, texture.height);
          const pixelIndex = (y - 1) * texture.width * 4 + (x - 1) * 4;
          const pixelData = imageData.data.slice(pixelIndex, pixelIndex + 4);
          const color = new Color(pixelData[0], pixelData[1], pixelData[2], pixelData[3]);
          image.remove();
          canvas.remove();
          return color;
        }

        /**
         * 将图像转为 Base64 字符（仅 png、jpg 或 jpeg 格式资源）（有问题）
         * @param url 图像地址
         * @param callback 完成回调
         */
        static imageToBase64(url, callback) {
          return new Promise(res => {
            var _exec;
            let extname = (_exec = /\.png|\.jpg|\.jpeg/.exec(url)) == null ? void 0 : _exec[0];
            //@ts-ignore
            if (['.png', '.jpg', '.jpeg'].includes(extname)) {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const image = new Image();
              image.src = url;
              image.onload = () => {
                canvas.height = image.height;
                canvas.width = image.width;
                ctx.drawImage(image, 0, 0);
                extname = extname === '.jpg' ? 'jpeg' : extname.replace('.', '');
                const dataURL = canvas.toDataURL(`image/${extname}`);
                callback && callback(dataURL);
                res(dataURL);
                image.remove();
                canvas.remove();
              };
            } else {
              console.warn('Not a jpg/jpeg or png resource!');
              callback && callback("");
              res("");
            }
          });
        }

        /**
         * 将 Base64 字符转为 cc.Texture2D 资源（有问题）
         * @param base64 Base64 字符
         */
        static base64ToTexture(base64) {
          const image = document.createElement('img');
          image.src = base64;
          const texture = new Texture2D();
          //@ts-ignore
          texture.initWithElement(image);
          image.remove();
          return texture;
        }

        /**
         * 将 Base64 字符转为二进制数据（有问题）
         * @param base64 Base64 字符
         */
        static base64ToBlob(base64) {
          const strings = base64.split(',');
          //@ts-ignore
          const type = /image\/\w+|;/.exec(strings[0])[0];
          const data = window.atob(strings[1]);
          const arrayBuffer = new ArrayBuffer(data.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < data.length; i++) {
            uint8Array[i] = data.charCodeAt(i) & 0xff;
          }
          return new Blob([uint8Array], {
            type: type
          });
        }
      }
      exports('ImageUtil', ImageUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/index.ts", ['cc', './BehaviorTree.ts', './BranchNode.ts', './Decorator.ts', './BTreeNode.ts', './Priority.ts', './Sequence.ts', './Task.ts', './Selector.ts'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      exports('BehaviorTree', module.BehaviorTree);
    }, function (module) {
      exports('BranchNode', module.BranchNode);
    }, function (module) {
      exports('Decorator', module.Decorator);
    }, function (module) {
      exports('BTreeNode', module.BTreeNode);
    }, function (module) {
      exports('Priority', module.Priority);
    }, function (module) {
      exports('Sequence', module.Sequence);
    }, function (module) {
      exports('Task', module.Task);
    }, function (module) {
      exports('Selector', module.Selector);
    }],
    execute: function () {
      cclegacy._RF.push({}, "96257XYurdITbWhyEf7Qlbn", "index", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Initialize.ts", ['cc', './ECS.ts', './Account.ts', './InitRes.ts'], function (exports) {
  var cclegacy, ecs, Account, InitResComp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      Account = module.Account;
    }, function (module) {
      InitResComp = module.InitResComp;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "ffbceQs6Z9IoI5z6mt1avMw", "Initialize", undefined);

      /**
       * 游戏进入初始化模块
       * 1、热更新
       * 2、加载默认资源
       */
      let Initialize = exports('Initialize', (_dec = ecs.register('Initialize'), _dec(_class = class Initialize extends ecs.Entity {
        constructor(...args) {
          super(...args);
          /** 帐号管理 */
          this.account = null;
        }
        init() {
          // 帐号模块为初始化模块的子实体对象
          this.account = ecs.getEntity(Account);
          this.addChild(this.account);

          // 初始化游戏公共资源
          this.add(InitResComp);
        }
      }) || _class));

      // export class EcsInitializeSystem extends ecs.System {
      //     constructor() {
      //         super();

      //         this.add(new InitResSystem());
      //     }
      // }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/InitRes.ts", ['cc', './Oops.ts', './AsyncQueue.ts', './ECS.ts', './GameUIConfig.ts', './LoadingViewComp.ts'], function (exports) {
  var cclegacy, oops, AsyncQueue, ecs, UIID, LoadingViewComp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      AsyncQueue = module.AsyncQueue;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      LoadingViewComp = module.LoadingViewComp;
    }],
    execute: function () {
      var _dec, _class, _dec2, _class2;
      cclegacy._RF.push({}, "2ee0c8+7R9EFKQb+OPn9mlk", "InitRes", undefined);

      /** 初始化游戏公共资源 */
      let InitResComp = exports('InitResComp', (_dec = ecs.register('InitRes'), _dec(_class = class InitResComp extends ecs.Comp {
        reset() {}
      }) || _class));
      let InitResSystem = exports('InitResSystem', (_dec2 = ecs.register('Initialize'), _dec2(_class2 = class InitResSystem extends ecs.ComblockSystem {
        filter() {
          return ecs.allOf(InitResComp);
        }
        entityEnter(e) {
          var queue = new AsyncQueue();

          // 加载自定义资源
          this.loadCustom(queue);
          // 加载多语言包
          this.loadLanguage(queue);
          // 加载公共资源
          this.loadCommon(queue);
          // 加载游戏内容加载进度提示界面
          this.onComplete(queue, e);
          queue.play();
        }

        /** 加载自定义内容（可选） */
        loadCustom(queue) {
          queue.push(async (next, params, args) => {
            // 加载多语言对应字体
            oops.res.load("language/font/" + oops.language.current, next);
          });
        }

        /** 加载化语言包（可选） */
        loadLanguage(queue) {
          queue.push((next, params, args) => {
            // 设置默认语言
            let lan = oops.storage.get("language");
            // if (lan == null) {
            if (lan == null || lan == "") {
              lan = "zh";
              oops.storage.set("language", lan);
            }

            // 设置语言包路径
            oops.language.pack.json = oops.config.game.languagePathJson;
            oops.language.pack.texture = oops.config.game.languagePathTexture;

            // 加载语言包资源
            oops.language.setLanguage(lan, next);
          });
        }

        /** 加载公共资源（必备） */
        loadCommon(queue) {
          queue.push((next, params, args) => {
            oops.res.loadDir("common", next);
          });
        }

        /** 加载完成进入游戏内容加载界面 */
        onComplete(queue, e) {
          queue.complete = async () => {
            var node = await oops.gui.openAsync(UIID.Loading);
            if (node) e.add(node.getComponent(LoadingViewComp));
            e.remove(InitResComp);
          };
        }
      }) || _class2));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/JsonOb.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "000b00Lx19Ke4hAFc9/Qlnh", "JsonOb", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-09-01 18:00:28
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-06 17:18:05
       */

      /**
       * 实现动态绑定的核心部分，
       * 每次修改属性值，都会调用对应函数，并且获取值的路径
       */
      const OP = Object.prototype;
      const types = {
        obj: '[object Object]',
        array: '[object Array]'
      };
      const OAM = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];

      /**
       * 实现属性拦截的类
       */
      class JsonOb {
        constructor(obj, callback) {
          this._callback = void 0;
          if (OP.toString.call(obj) !== types.obj && OP.toString.call(obj) !== types.array) {
            console.error('请传入一个对象或数组');
          }
          this._callback = callback;
          this.observe(obj);
        }
        /**对象属性劫持 */
        observe(obj, path) {
          if (OP.toString.call(obj) === types.array) {
            this.overrideArrayProto(obj, path);
          }

          // @ts-ignore  注：避免API生成工具报错
          Object.keys(obj).forEach(key => {
            let self = this;
            // @ts-ignore
            let oldVal = obj[key];
            let pathArray = path && path.slice();
            if (pathArray) {
              pathArray.push(key);
            } else {
              pathArray = [key];
            }
            Object.defineProperty(obj, key, {
              get: function () {
                return oldVal;
              },
              set: function (newVal) {
                //cc.log(newVal);
                if (oldVal !== newVal) {
                  if (OP.toString.call(newVal) === '[object Object]') {
                    self.observe(newVal, pathArray);
                  }
                  self._callback(newVal, oldVal, pathArray);
                  oldVal = newVal;
                }
              }
            });

            // @ts-ignore
            if (OP.toString.call(obj[key]) === types.obj || OP.toString.call(obj[key]) === types.array) {
              // @ts-ignore
              this.observe(obj[key], pathArray);
            }
          }, this);
        }

        /**
         * 对数组类型进行动态绑定
         * @param array 
         * @param path 
         */
        overrideArrayProto(array, path) {
          // 保存原始 Array 原型  
          var originalProto = Array.prototype;
          // 通过 Object.create 方法创建一个对象，该对象的原型是Array.prototype  
          var overrideProto = Object.create(Array.prototype);
          var self = this;
          var result;

          // 遍历要重写的数组方法  
          OAM.forEach(method => {
            Object.defineProperty(overrideProto, method, {
              value: function () {
                var oldVal = this.slice();
                //调用原始原型上的方法  
                result = originalProto[method].apply(this, arguments);
                //继续监听新数组  
                self.observe(this, path);
                self._callback(this, oldVal, path);
                return result;
              }
            });
          });

          // 最后 让该数组实例的 __proto__ 属性指向 假的原型 overrideProto  
          array['__proto__'] = overrideProto;
        }
      }
      exports('JsonOb', JsonOb);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/JsonUtil.ts", ['cc', './Oops.ts'], function (exports) {
  var cclegacy, JsonAsset, oops;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      JsonAsset = module.JsonAsset;
    }, function (module) {
      oops = module.oops;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1a24ank4nRC46jfzaIfOmtQ", "JsonUtil", undefined);

      /** 资源路径 */
      var path = "config/game/";

      /** 数据缓存 */
      var data = new Map();

      /** JSON数据表工具 */
      class JsonUtil {
        /**
         * 通知资源名从缓存中获取一个Json数据表
         * @param name  资源名
         */
        static get(name) {
          if (data.has(name)) return data.get(name);
        }

        /**
         * 通知资源名加载Json数据表
         * @param name      资源名
         * @param callback  资源加载完成回调
         */
        static load(name, callback) {
          if (data.has(name)) callback(data.get(name));else {
            var url = path + name;
            oops.res.load(url, JsonAsset, (err, content) => {
              if (err) {
                console.warn(err.message);
                callback(null);
              } else {
                data.set(name, content.json);
                callback(content.json);
              }
            });
          }
        }

        /**
         * 异步加载Json数据表
         * @param name 资源名
         */
        static loadAsync(name) {
          return new Promise((resolve, reject) => {
            if (data.has(name)) {
              resolve(data.get(name));
            } else {
              var url = path + name;
              oops.res.load(url, JsonAsset, (err, content) => {
                if (err) {
                  console.warn(err.message);
                  resolve(null);
                } else {
                  data.set(name, content.json);
                  resolve(content.json);
                }
              });
            }
          });
        }

        /**
         * 通过指定资源名释放资源
         * @param name 资源名
         */
        static release(name) {
          var url = path + name;
          data.delete(name);
          oops.res.release(url);
        }
      }
      exports('JsonUtil', JsonUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LabelChange.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './LabelNumber.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, LabelNumber;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      LabelNumber = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "fff0fLwVNhNe59VirWTCPFJ", "LabelChange", undefined);
      const {
        ccclass,
        property,
        menu
      } = _decorator;

      /** 数值变化动画标签组件 */
      let LabelChange = exports('LabelChange', (_dec = ccclass("LabelChange"), _dec2 = menu('ui/label/LabelChange'), _dec(_class = _dec2(_class = (_class2 = class LabelChange extends LabelNumber {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "isInteger", _descriptor, this);
          this.duration = 0;
          // 持续时间
          this.callback = void 0;
          // 完成回调
          this.isBegin = false;
          // 是否开始
          this.speed = 0;
          // 变化速度
          this.end = 0;
        }
        // 最终值
        /**
         * 变化到某值,如果从当前开始的begin传入null
         * @param {number} duration 
         * @param {number} end 
         * @param {Function} [callback]
         */
        changeTo(duration, end, callback) {
          if (duration == 0) {
            if (callback) callback();
            return;
          }
          this.playAnim(duration, this.num, end, callback);
        }

        /**
         * 变化值,如果从当前开始的begin传入null
         * @param {number} duration 
         * @param {number} value 
         * @param {Function} [callback] 
         * @memberof LabelChange
         */
        changeBy(duration, value, callback) {
          if (duration == 0) {
            if (callback) callback();
            return;
          }
          this.playAnim(duration, this.num, this.num + value, callback);
        }

        /** 立刻停止 */
        stop(excCallback = true) {
          this.num = this.end;
          this.isBegin = false;
          if (excCallback && this.callback) this.callback();
        }

        /** 播放动画 */
        playAnim(duration, begin, end, callback) {
          this.duration = duration;
          this.end = end;
          this.callback = callback;
          this.speed = (end - begin) / duration;
          this.num = begin;
          this.isBegin = true;
        }

        /** 是否已经结束 */
        isEnd(num) {
          if (this.speed > 0) {
            return num >= this.end;
          } else {
            return num <= this.end;
          }
        }
        update(dt) {
          if (this.isBegin) {
            if (this.num == this.end) {
              this.isBegin = false;
              if (this.callback) this.callback();
              return;
            }
            let num = this.num + dt * this.speed;
            if (this.isInteger) {
              if (this.end < this.num) {
                num = Math.floor(num);
              } else {
                num = Math.ceil(num);
              }
            }

            /** 变化完成 */
            if (this.isEnd(num)) {
              num = this.end;
              this.isBegin = false;
              if (this.callback) this.callback();
            }
            this.num = num;
          }
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "isInteger", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LabelNumber.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Label, error;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      error = module.error;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "f7b43F70BhPlrz4IPhZGmsL", "LabelNumber", undefined);
      const {
        ccclass,
        property,
        menu
      } = _decorator;

      /** 只能显示数字的标签组件 */
      let LabelNumber = exports('default', (_dec = ccclass("LabelNumber"), _dec2 = menu('ui/label/LabelNumber'), _dec3 = property({
        tooltip: "数字"
      }), _dec4 = property({
        tooltip: "数字"
      }), _dec5 = property({
        tooltip: "货币符号"
      }), _dec(_class = _dec2(_class = (_class2 = class LabelNumber extends Label {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "_num", _descriptor, this);
          _initializerDefineProperty(this, "symbol", _descriptor2, this);
        }
        get num() {
          return this._num;
        }
        set num(value) {
          this._num = value;
          this.updateLabel();
        }
        start() {
          this.updateLabel();
        }

        /** 刷新文本 */
        updateLabel() {
          if (typeof this._num != "number") {
            error("[LabelNumber] num不是一个合法数字");
          }
          this.string = this.num.toString() + this.symbol;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_num", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "num", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "num"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "symbol", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      })), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LabelTime.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Label;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "57786GMN6RPbaAT9b9RmX18", "LabelTime", undefined);
      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let LabelTime = exports('default', (_dec = ccclass("LabelTime"), _dec2 = menu('ui/label/LabelTime'), _dec3 = property({
        tooltip: "到计时间总时间（单位秒）"
      }), _dec4 = property({
        tooltip: "天数数据格式化"
      }), _dec5 = property({
        tooltip: "时间格式化"
      }), _dec6 = property({
        tooltip: "是否有00"
      }), _dec(_class = _dec2(_class = (_class2 = class LabelTime extends Label {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "countDown", _descriptor, this);
          _initializerDefineProperty(this, "dayFormat", _descriptor2, this);
          _initializerDefineProperty(this, "timeFormat", _descriptor3, this);
          _initializerDefineProperty(this, "zeroize", _descriptor4, this);
          this.dateDisable = void 0;
          this.result = void 0;
          /** 每秒触发事件 */
          this.onSecond = null;
          /** 倒计时完成事件 */
          this.onComplete = null;
        }
        replace(value, ...args) {
          return value.replace(/\{(\d+)\}/g, function (m, i) {
            return args[i];
          });
        }

        /** 格式化字符串 */
        format() {
          let c = this.countDown;
          let date = Math.floor(c / 86400);
          c = c - date * 86400;
          let hours = Math.floor(c / 3600);
          c = c - hours * 3600;
          let minutes = Math.floor(c / 60);
          c = c - minutes * 60;
          let seconds = c;
          this.dateDisable = this.dateDisable || false;
          if (date == 0 && hours == 0 && minutes == 0 && seconds == 0) {
            if (this.zeroize) {
              this.result = this.replace(this.timeFormat, "00", "00", "00");
            } else {
              this.result = this.replace(this.timeFormat, "0", "0", "0");
            }
          } else if (date > 0 && !this.dateDisable) {
            let dataFormat = this.dayFormat;
            let index = dataFormat.indexOf("{1}");
            if (hours == 0 && index > -1) {
              dataFormat = dataFormat.substring(0, index - 1);
            }
            let df = dataFormat;
            if (date > 1 && dataFormat.indexOf("days") < 0) {
              df = df.replace("day", "days");
            }
            if (date < 2) {
              df = df.replace("days", "day");
            }
            this.result = this.replace(df, date, hours); // 如果天大于1，则显示 "1 Day..."
          } else {
            hours += date * 24;
            if (this.zeroize) {
              this.result = this.replace(this.timeFormat, this.coverString(hours), this.coverString(minutes), this.coverString(seconds)); // 否则显示 "01:12:24"
            } else {
              this.result = this.replace(this.timeFormat, hours, minutes, seconds);
            }
          }
          this.string = this.result;
        }

        /** 个位数的时间数据将字符串补位 */
        coverString(value) {
          if (value < 10) return "0" + value;
          return value.toString();
        }

        /** 设置时间能否由天数显示 */
        setDateDisable(flag) {
          this.dateDisable = flag;
        }

        /** 设置倒计时时间 */
        setTime(second) {
          this.countDown = second; // 倒计时，初始化显示字符串
          this.timing_end();
          this.timing_start();
        }
        start() {
          this.timing_start();
        }
        onScheduleSecond() {
          this.countDown--;
          this.format();
          if (this.onSecond) this.onSecond(this.node);
          if (this.countDown == 0) {
            this.onScheduleComplete();
          }
        }
        onScheduleComplete() {
          this.timing_end();
          if (this.onComplete) this.onComplete(this.node);
        }

        /** 开始计时 */
        timing_start() {
          this.schedule(this.onScheduleSecond, 1);
          this.format();
        }
        timing_end() {
          this.unscheduleAllCallbacks();
          this.format();
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "countDown", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1000;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "dayFormat", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "{0} day";
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "timeFormat", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "{0}:{1}:{2}";
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "zeroize", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      })), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Language.ts", ['cc', './EventDispatcher.ts', './Logger.ts', './LanguageData.ts', './LanguagePack.ts'], function (exports) {
  var cclegacy, EventDispatcher, Logger, LanguageData, LanguagePack;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      EventDispatcher = module.EventDispatcher;
    }, function (module) {
      Logger = module.Logger;
    }, function (module) {
      LanguageData = module.LanguageData;
    }, function (module) {
      LanguagePack = module.LanguagePack;
    }],
    execute: function () {
      cclegacy._RF.push({}, "3757cxZqLZObIdvP/gQ6Yuj", "Language", undefined);
      let LanguageEvent = exports('LanguageEvent', /*#__PURE__*/function (LanguageEvent) {
        LanguageEvent["CHANGE"] = "LanguageEvent.CHANGE";
        LanguageEvent["RELEASE_RES"] = "LanguageEvent.RELEASE_RES";
        return LanguageEvent;
      }({}));
      class LanguageManager extends EventDispatcher {
        constructor(...args) {
          super(...args);
          this._languages = ["zh", "en", "tr"];
          // 支持的语言
          this._languagePack = new LanguagePack();
          // 语言包
          this._defaultLanguage = "zh";
        }
        // 默认语言
        /** 支持的多种语言列表 */
        get languages() {
          return this._languages;
        }
        set languages(languages) {
          this._languages = languages;
        }

        /** 设置的当前语言列表中没有配置时，使用默认语言 */
        set default(lang) {
          this._defaultLanguage = lang || "zh";
        }

        /** 获取当前语种 */
        get current() {
          return LanguageData.current;
        }

        /** 语言包 */
        get pack() {
          return this._languagePack;
        }
        isExist(lang) {
          return this.languages.indexOf(lang) > -1;
        }

        /**
         * 获取下一个语种
         */
        getNextLang() {
          let supportLangs = this.languages;
          let index = supportLangs.indexOf(LanguageData.current);
          let newLanguage = supportLangs[(index + 1) % supportLangs.length];
          return newLanguage;
        }

        /**
         * 改变语种，会自动下载对应的语种，下载完成回调
         * @param language 
         */
        setLanguage(language, callback) {
          if (language == null || language == "") {
            language = this._defaultLanguage;
          } else {
            language = language.toLowerCase();
          }
          let index = this.languages.indexOf(language);
          if (index < 0) {
            console.log(`当前不支持【${language}】语言，将自动切换到【${this._defaultLanguage}】语言`);
            language = this._defaultLanguage;
          }
          if (language === LanguageData.current) {
            callback(false);
            return;
          }
          this.loadLanguageAssets(language, lang => {
            Logger.logConfig(`当前语言为【${language}】`);
            LanguageData.current = language;
            this._languagePack.updateLanguage(language);
            this.dispatchEvent(LanguageEvent.CHANGE, lang);
            callback(true);
          });
        }

        /**
         * 根据data获取对应语种的字符
         * @param labId 
         * @param arr 
         */
        getLangByID(labId) {
          return LanguageData.getLangByID(labId);
        }

        /**
         * 下载语言包素材资源
         * 包括语言json配置和语言纹理包
         * @param lang 
         * @param callback 
         */
        loadLanguageAssets(lang, callback) {
          lang = lang.toLowerCase();
          return this._languagePack.loadLanguageAssets(lang, callback);
        }

        /**
         * 释放不需要的语言包资源
         * @param lang 
         */
        releaseLanguageAssets(lang) {
          lang = lang.toLowerCase();
          this._languagePack.releaseLanguageAssets(lang);
          this.dispatchEvent(LanguageEvent.RELEASE_RES, lang);
        }
      }
      exports('LanguageManager', LanguageManager);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LanguageData.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "27fb3sjD81JlIP2KFTSWUp4", "LanguageData", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-02-11 09:31:52
       * @LastEditors: dgflash
       * @LastEditTime: 2023-08-22 16:37:40
       */
      class LanguageData {
        /** 
         * 通过多语言关键字获取语言文本 
         * 
         * 注：
         * 
         * 1、先获取language/json中的配置数据，如果没有者获取config/game/Language配置表中的多语言数据
         * 
         * 2、config/game/Language配置表可选使用，不用时不创建同名配置表即可
         * 
         * 3、config/game/Language配置表使用oops-plugin-excel-to-json插件生成，点击项目根目录下载update-oops-plugin-framework.bat或update-oops-plugin-framework.sh脚本下载插件
         */
        static getLangByID(labId) {
          var text = this.json[labId];
          if (text) {
            return text;
          }
          if (this.excel) {
            var record = this.excel[labId];
            if (record) {
              return record[this.current];
            }
          }
          return labId;
        }
      }
      exports('LanguageData', LanguageData);
      /** 当前语言 */
      LanguageData.current = "";
      /** 语言JSON配置数据 */
      LanguageData.json = {};
      /** 语言EXCEL中的配置数据 */
      LanguageData.excel = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LanguageLabel.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Oops.ts', './LanguageData.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, CCString, _decorator, Component, warn, Label, RichText, TTFFont, oops, LanguageData;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      CCString = module.CCString;
      _decorator = module._decorator;
      Component = module.Component;
      warn = module.warn;
      Label = module.Label;
      RichText = module.RichText;
      TTFFont = module.TTFFont;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      LanguageData = module.LanguageData;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _descriptor2, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class4, _class5, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "110c8vEd5NEPL/N9meGQnaX", "LanguageLabel", undefined);
      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let LangLabelParamsItem = exports('LangLabelParamsItem', (_dec = ccclass("LangLabelParamsItem"), _dec(_class = (_class2 = class LangLabelParamsItem {
        constructor() {
          _initializerDefineProperty(this, "key", _descriptor, this);
          _initializerDefineProperty(this, "value", _descriptor2, this);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "key", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "value", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      })), _class2)) || _class));
      let LanguageLabel = exports('LanguageLabel', (_dec2 = ccclass("LanguageLabel"), _dec3 = menu('ui/language/LanguageLabel'), _dec4 = property({
        type: LangLabelParamsItem,
        displayName: "params"
      }), _dec5 = property({
        type: LangLabelParamsItem,
        displayName: "params"
      }), _dec6 = property({
        serializable: true
      }), _dec7 = property({
        type: CCString,
        serializable: true
      }), _dec2(_class4 = _dec3(_class4 = (_class5 = class LanguageLabel extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "_params", _descriptor3, this);
          _initializerDefineProperty(this, "_dataID", _descriptor4, this);
          /** 初始字体尺寸 */
          this.initFontSize = 0;
          this._needUpdate = false;
        }
        set params(value) {
          this._params = value;
          {
            this._needUpdate = true;
          }
        }
        get params() {
          return this._params || [];
        }
        get dataID() {
          return this._dataID || "";
        }
        set dataID(value) {
          this._dataID = value;
          {
            this._needUpdate = true;
          }
        }
        get string() {
          let _string = LanguageData.getLangByID(this._dataID);
          if (_string && this._params.length > 0) {
            this._params.forEach(item => {
              _string = _string.replace(`%{${item.key}}`, item.value);
            });
          }
          if (!_string) {
            warn("[LanguageLabel] 未找到语言标识，使用dataID替换");
            _string = this._dataID;
          }
          return _string;
        }

        /** 更新语言 */
        language() {
          this._needUpdate = true;
        }
        onLoad() {
          this._needUpdate = true;
        }

        /**
         * 修改多语言参数，采用惰性求值策略
         * @param key 对于i18n表里面的key值
         * @param value 替换的文本
         */
        setVars(key, value) {
          let haskey = false;
          for (let i = 0; i < this._params.length; i++) {
            let element = this._params[i];
            if (element.key === key) {
              element.value = value;
              haskey = true;
            }
          }
          if (!haskey) {
            let ii = new LangLabelParamsItem();
            ii.key = key;
            ii.value = value;
            this._params.push(ii);
          }
          this._needUpdate = true;
        }
        update() {
          if (this._needUpdate) {
            this.updateContent();
            this._needUpdate = false;
          }
        }
        updateContent() {
          var label = this.getComponent(Label);
          var richtext = this.getComponent(RichText);
          var path = oops.language.pack.json + "/" + oops.language.current;
          var font = oops.res.get(path, TTFFont);
          if (label) {
            if (font && !label.useSystemFont) {
              label.font = font;
            }
            label.string = this.string;
            this.initFontSize = label.fontSize;
          } else if (richtext) {
            if (font && !richtext.useSystemFont) {
              richtext.font = font;
            }
            this.initFontSize = richtext.fontSize;
            richtext.string = this.string;
            this.initFontSize = richtext.fontSize;
          } else {
            warn("[LanguageLabel], 该节点没有cc.Label || cc.RichText组件");
          }
        }
      }, (_descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "_params", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _applyDecoratedDescriptor(_class5.prototype, "params", [_dec5], Object.getOwnPropertyDescriptor(_class5.prototype, "params"), _class5.prototype), _descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "_dataID", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      }), _applyDecoratedDescriptor(_class5.prototype, "dataID", [_dec7], Object.getOwnPropertyDescriptor(_class5.prototype, "dataID"), _class5.prototype)), _class5)) || _class4) || _class4));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LanguagePack.ts", ['cc', './Logger.ts', './Oops.ts', './JsonUtil.ts', './LanguageData.ts', './LanguageLabel.ts', './LanguageSpine.ts', './LanguageSprite.ts'], function (exports) {
  var cclegacy, director, error, JsonAsset, TTFFont, Logger, oops, JsonUtil, LanguageData, LanguageLabel, LanguageSpine, LanguageSprite;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
      error = module.error;
      JsonAsset = module.JsonAsset;
      TTFFont = module.TTFFont;
    }, function (module) {
      Logger = module.Logger;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      JsonUtil = module.JsonUtil;
    }, function (module) {
      LanguageData = module.LanguageData;
    }, function (module) {
      LanguageLabel = module.LanguageLabel;
    }, function (module) {
      LanguageSpine = module.LanguageSpine;
    }, function (module) {
      LanguageSprite = module.LanguageSprite;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2ffebyj59xIc4v4BZty8SDm", "LanguagePack", undefined);
      class LanguagePack {
        constructor() {
          /** JSON资源目录 */
          this.json = "language/json";
          /** 纹理资源目录 */
          this.texture = "language/texture";
          /** SPINE资源目录 */
          this.spine = "language/spine";
        }
        /**
         * 刷新语言文字
         * @param lang 
         */
        updateLanguage(lang) {
          let rootNodes = director.getScene().children;
          for (let i = 0; i < rootNodes.length; ++i) {
            // 更新所有的LanguageLabel节点
            let labels = rootNodes[i].getComponentsInChildren(LanguageLabel);
            for (let j = 0; j < labels.length; j++) {
              labels[j].language();
            }

            // 更新所有的LanguageSprite节点
            let sprites = rootNodes[i].getComponentsInChildren(LanguageSprite);
            for (let j = 0; j < sprites.length; j++) {
              sprites[j].language();
            }

            // 更新所有的LanguageSpine节点
            let spines = rootNodes[i].getComponentsInChildren(LanguageSpine);
            for (let j = 0; j < spines.length; j++) {
              spines[j].language();
            }
          }
        }

        /**
         * 下载对应语言包资源
         * @param lang 语言标识
         * @param callback 下载完成回调
         */
        async loadLanguageAssets(lang, callback) {
          await this.loadTexture(lang);
          await this.loadSpine(lang);
          await this.loadJson(lang);
          await this.loadTable(lang);
          callback(lang);
        }

        /** 多语言Excel配置表数据 */
        loadTable(lang) {
          return new Promise(async (resolve, reject) => {
            LanguageData.excel = await JsonUtil.loadAsync("Language");
            if (LanguageData.excel) {
              Logger.logConfig("config/game/Language", "下载语言包 table 资源");
            }
            resolve(null);
          });
        }

        /** 纹理多语言资源 */
        loadTexture(lang) {
          return new Promise((resolve, reject) => {
            let path = `${this.texture}/${lang}`;
            oops.res.loadDir(path, (err, assets) => {
              if (err) {
                error(err);
                resolve(null);
                return;
              }
              Logger.logConfig(path, "下载语言包 textures 资源");
              resolve(null);
            });
          });
        }

        /** Json格式多语言资源 */
        loadJson(lang) {
          return new Promise((resolve, reject) => {
            let path = `${this.json}/${lang}`;
            oops.res.load(path, JsonAsset, (err, asste) => {
              if (err) {
                error(err);
                resolve(null);
                return;
              }
              LanguageData.json = asste.json;
              Logger.logConfig(path, "下载语言包 json 资源");
              oops.res.load(path, TTFFont, err => {
                if (err == null) Logger.logConfig(path, "下载语言包 ttf 资源");
                resolve(null);
              });
            });
          });
        }

        /** SPINE动画多语言资源 */
        loadSpine(lang) {
          return new Promise((resolve, reject) => {
            let path = `${this.spine}/${lang}`;
            oops.res.loadDir(path, (err, assets) => {
              if (err) {
                error(err);
                resolve(null);
                return;
              }
              Logger.logConfig(path, "下载语言包 spine 资源");
              resolve(null);
            });
          });
        }

        /**
         * 释放某个语言的语言包资源包括json
         * @param lang 
         */
        releaseLanguageAssets(lang) {
          let langTexture = `${this.texture}/${lang}`;
          oops.res.releaseDir(langTexture);
          Logger.logView(langTexture, "释放语言 texture 资源");
          let langJson = `${this.json}/${lang}`;
          oops.res.release(langJson);
          Logger.logView(langJson, "释放语言文字资源");
          let langSpine = `${this.spine}/${lang}`;
          oops.res.release(langSpine);
          Logger.logView(langSpine, "释放语言 spine 资源");
        }
      }
      exports('LanguagePack', LanguagePack);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LanguageSpine.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Oops.ts', './LanguageData.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, CCString, _decorator, Component, sp, oops, LanguageData;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      CCString = module.CCString;
      _decorator = module._decorator;
      Component = module.Component;
      sp = module.sp;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      LanguageData = module.LanguageData;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "53e25hqV6VEJqayXfz6Qam2", "LanguageSpine", undefined);
      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let LanguageSpine = exports('LanguageSpine', (_dec = ccclass("LanguageSpine"), _dec2 = menu('ui/language/LanguageSpine'), _dec3 = property({
        serializable: true
      }), _dec4 = property({
        type: CCString,
        serializable: true
      }), _dec(_class = _dec2(_class = (_class2 = class LanguageSpine extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "_dataID", _descriptor, this);
          /** 默认动画名 */
          this._defaultAnimation = "";
        }
        get dataID() {
          return this._dataID || "";
        }
        set dataID(value) {
          this._dataID = value;
          {
            this.updateSpine();
          }
        }
        onLoad() {
          let spine = this.getComponent(sp.Skeleton);
          this._defaultAnimation = spine.animation;
        }
        start() {
          this.updateSpine();
        }

        /** 更新语言 */
        language() {
          this.updateSpine();
        }
        updateSpine() {
          // 获取语言标记
          let path = `language/spine/${LanguageData.current}/${this.dataID}`;
          let res = oops.res.get(path, sp.SkeletonData);
          if (res) {
            let spine = this.getComponent(sp.Skeleton);
            spine.skeletonData = res;
            spine.setAnimation(0, this._defaultAnimation, true);
          } else {
            console.error("[LanguageSpine] 资源不存在 " + path);
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_dataID", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "dataID", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "dataID"), _class2.prototype)), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LanguageSprite.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Oops.ts', './LanguageData.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, CCString, _decorator, Component, SpriteFrame, Sprite, UITransform, oops, LanguageData;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      CCString = module.CCString;
      _decorator = module._decorator;
      Component = module.Component;
      SpriteFrame = module.SpriteFrame;
      Sprite = module.Sprite;
      UITransform = module.UITransform;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      LanguageData = module.LanguageData;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "11b96k/RIZF57Loehxyl6Hs", "LanguageSprite", undefined);
      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let LanguageSprite = exports('LanguageSprite', (_dec = ccclass("LanguageSprite"), _dec2 = menu('ui/language/LanguageSprite'), _dec3 = property({
        serializable: true
      }), _dec4 = property({
        type: CCString,
        serializable: true
      }), _dec5 = property({
        tooltip: "是否设置为图片原始资源大小"
      }), _dec(_class = _dec2(_class = (_class2 = class LanguageSprite extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "_dataID", _descriptor, this);
          _initializerDefineProperty(this, "isRawSize", _descriptor2, this);
        }
        get dataID() {
          return this._dataID || "";
        }
        set dataID(value) {
          this._dataID = value;
          {
            this.updateSprite();
          }
        }
        start() {
          this.updateSprite();
        }

        /** 更新语言 */
        language() {
          this.updateSprite();
        }
        updateSprite() {
          // 获取语言标记
          let path = `language/texture/${LanguageData.current}/${this.dataID}/spriteFrame`;
          let res = oops.res.get(path, SpriteFrame);
          if (res) {
            let spcomp = this.getComponent(Sprite);
            spcomp.spriteFrame = res;

            /** 修改节点为原始图片资源大小 */
            if (this.isRawSize) {
              var _spcomp$getComponent;
              //@ts-ignore
              let rawSize = res._originalSize;
              (_spcomp$getComponent = spcomp.getComponent(UITransform)) == null || _spcomp$getComponent.setContentSize(rawSize);
            }
          } else {
            console.error("[LanguageSprite] 资源不存在 " + path);
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_dataID", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "dataID", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "dataID"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "isRawSize", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      })), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LayerDialog.ts", ['cc', './Defines.ts', './LayerPopup.ts'], function (exports) {
  var cclegacy, ViewParams, LayerPopUp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ViewParams = module.ViewParams;
    }, function (module) {
      LayerPopUp = module.LayerPopUp;
    }],
    execute: function () {
      cclegacy._RF.push({}, "dcad5w8wHlEDJpIKJ4gUxEP", "LayerDialog", undefined);

      /** 模式弹窗数据 */

      /*
       * 模式弹窗层，该层的窗口同时只能显示一个，删除以后会自动从队列当中取一个弹窗，直到队列为空
       */
      class LayerDialog extends LayerPopUp {
        constructor(...args) {
          super(...args);
          /** 窗口调用参数队列 */
          this.params = [];
        }
        add(config, params, callbacks) {
          // 控制同一时间只能显示一个模式窗口
          if (this.ui_nodes.size > 0) {
            this.params.push({
              config: config,
              params: params,
              callbacks: callbacks
            });
            return;
          }
          this.black.enabled = true;
          this.show(config, params, callbacks);
        }

        /** 显示模式弹窗 */
        show(config, params, callbacks) {
          var vp = this.ui_cache.get(config.prefab);
          if (vp == null) {
            vp = new ViewParams();
            vp.config = config;
            vp.valid = true;
          }
          this.ui_nodes.set(vp.config.prefab, vp);
          vp.callbacks = callbacks ?? {};
          var onRemove_Source = vp.callbacks.onRemoved;
          vp.callbacks.onRemoved = (node, params) => {
            if (onRemove_Source) {
              onRemove_Source(node, params);
            }
            setTimeout(this.next.bind(this), 0);
          };
          vp.params = params || {};
          this.load(vp, config.bundle);
          return config.prefab;
        }
        setBlackDisable() {
          if (this.params.length == 0) {
            this.black.enabled = false;
            this.closeVacancyRemove();
            this.closeMask();
          }
        }
        next() {
          if (this.params.length > 0) {
            let param = this.params.shift();
            this.show(param.config, param.params, param.callbacks);
          }
        }
      }
      exports('LayerDialog', LayerDialog);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LayerManager.ts", ['cc', './GUI.ts', './DelegateComponent.ts', './LayerDialog.ts', './LayerNotify.ts', './LayerPopup.ts', './LayerUI.ts', './UIMap.ts'], function (exports) {
  var cclegacy, warn, Node, Camera, Layers, Widget, GUI, DelegateComponent, LayerDialog, LayerNotify, LayerPopUp, LayerUI, UIMap;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      warn = module.warn;
      Node = module.Node;
      Camera = module.Camera;
      Layers = module.Layers;
      Widget = module.Widget;
    }, function (module) {
      GUI = module.GUI;
    }, function (module) {
      DelegateComponent = module.DelegateComponent;
    }, function (module) {
      LayerDialog = module.LayerDialog;
    }, function (module) {
      LayerNotify = module.LayerNotify;
    }, function (module) {
      LayerPopUp = module.LayerPopUp;
    }, function (module) {
      LayerUI = module.LayerUI;
    }, function (module) {
      UIMap = module.UIMap;
    }],
    execute: function () {
      cclegacy._RF.push({}, "7ba675xFGdHqIOykTysNzEu", "LayerManager", undefined);

      /** 界面层类型 */
      let LayerType = exports('LayerType', /*#__PURE__*/function (LayerType) {
        LayerType["Game"] = "LayerGame";
        LayerType["UI"] = "LayerUI";
        LayerType["PopUp"] = "LayerPopUp";
        LayerType["Dialog"] = "LayerDialog";
        LayerType["System"] = "LayerSystem";
        LayerType["Notify"] = "LayerNotify";
        LayerType["Guide"] = "LayerGuide";
        return LayerType;
      }({}));

      /** 
       * 界面配置结构体
       * @example
      // 界面唯一标识
      export enum UIID {
          Loading = 1,
          Window,
          Netinstable
      }
        // 打开界面方式的配置数据
      export var UIConfigData: { [key: number]: UIConfig } = {
          [UIID.Loading]: { layer: LayerType.UI, prefab: "loading/prefab/loading", bundle: "resources" },
          [UIID.Netinstable]: { layer: LayerType.PopUp, prefab: "common/prefab/netinstable" },
          [UIID.Window]: { layer: LayerType.Dialog, prefab: "common/prefab/window" }
      }
       */

      /** 界面层级管理器 */
      class LayerManager {
        /** 是否为竖屏显示 */
        get portrait() {
          return this.root.getComponent(GUI).portrait;
        }

        /**
         * 初始化所有UI的配置对象
         * @param configs 配置对象
         */
        init(configs) {
          this.configs = configs;
        }

        /**
         * 渐隐飘过提示
         * @param content 文本表示
         * @param useI18n 是否使用多语言
         * @example 
         * oops.gui.toast("提示内容");
         */
        toast(content, useI18n = false) {
          this.notify.toast(content, useI18n);
        }

        /** 打开等待提示 */
        waitOpen() {
          this.notify.waitOpen();
        }

        /** 关闭等待提示 */
        waitClose() {
          this.notify.waitClose();
        }

        /**
         * 设置界面配置
         * @param uiId   要设置的界面id
         * @param config 要设置的配置
         */
        setConfig(uiId, config) {
          this.configs[uiId] = config;
        }

        /**
         * 设置界面地图配置
         * @param data 界面地图数据
         */
        setUIMap(data) {
          if (this.uiMap == null) {
            this.uiMap = new UIMap();
          }
          this.uiMap.init(this, data);
        }

        /**
         * 同步打开一个窗口
         * @param uiId          窗口唯一编号
         * @param uiArgs        窗口参数
         * @param callbacks     回调对象
         * @example
        var uic: UICallbacks = {
            onAdded: (node: Node, params: any) => {
                var comp = node.getComponent(LoadingViewComp) as ecs.Comp;
            }
            onRemoved:(node: Node | null, params: any) => {
                        
            }
        };
        oops.gui.open(UIID.Loading, null, uic);
         */
        open(uiId, uiArgs = null, callbacks) {
          var config = this.configs[uiId];
          if (config == null) {
            warn(`打开编号为【${uiId}】的界面失败，配置信息不存在`);
            return;
          }
          switch (config.layer) {
            case LayerType.UI:
              this.ui.add(config, uiArgs, callbacks);
              break;
            case LayerType.PopUp:
              this.popup.add(config, uiArgs, callbacks);
              break;
            case LayerType.Dialog:
              this.dialog.add(config, uiArgs, callbacks);
              break;
            case LayerType.System:
              this.system.add(config, uiArgs, callbacks);
              break;
          }
        }

        /**
         * 异步打开一个窗口
         * @param uiId          窗口唯一编号
         * @param uiArgs        窗口参数
         * @example 
         * var node = await oops.gui.openAsync(UIID.Loading);
         */
        async openAsync(uiId, uiArgs = null) {
          return new Promise((resolve, reject) => {
            var callbacks = {
              onAdded: (node, params) => {
                resolve(node);
              }
            };
            this.open(uiId, uiArgs, callbacks);
          });
        }

        /**
         * 场景替换
         * @param removeUiId  移除场景编号
         * @param openUiId    新打开场景编号
         * @param uiArgs      新打开场景参数
         */
        replace(removeUiId, openUiId, uiArgs = null) {
          this.open(openUiId, uiArgs);
          this.remove(removeUiId);
        }

        /**
         * 异步场景替换
         * @param removeUiId  移除场景编号
         * @param openUiId    新打开场景编号
         * @param uiArgs      新打开场景参数
         */
        replaceAsync(removeUiId, openUiId, uiArgs = null) {
          return new Promise(async (resolve, reject) => {
            var node = await this.openAsync(openUiId, uiArgs);
            this.remove(removeUiId);
            resolve(node);
          });
        }

        /**
         * 缓存中是否存在指定标识的窗口
         * @param uiId 窗口唯一标识
         * @example
         * oops.gui.has(UIID.Loading);
         */
        has(uiId) {
          var config = this.configs[uiId];
          if (config == null) {
            warn(`编号为【${uiId}】的界面配置不存在，配置信息不存在`);
            return false;
          }
          var result = false;
          switch (config.layer) {
            case LayerType.UI:
              result = this.ui.has(config.prefab);
              break;
            case LayerType.PopUp:
              result = this.popup.has(config.prefab);
              break;
            case LayerType.Dialog:
              result = this.dialog.has(config.prefab);
              break;
            case LayerType.System:
              result = this.system.has(config.prefab);
              break;
          }
          return result;
        }

        /**
         * 缓存中是否存在指定标识的窗口
         * @param uiId 窗口唯一标识
         * @example
         * oops.gui.has(UIID.Loading);
         */
        get(uiId) {
          var config = this.configs[uiId];
          if (config == null) {
            warn(`编号为【${uiId}】的界面配置不存在，配置信息不存在`);
            return null;
          }
          var result = null;
          switch (config.layer) {
            case LayerType.UI:
              result = this.ui.get(config.prefab);
              break;
            case LayerType.PopUp:
              result = this.popup.get(config.prefab);
              break;
            case LayerType.Dialog:
              result = this.dialog.get(config.prefab);
              break;
            case LayerType.System:
              result = this.system.get(config.prefab);
              break;
          }
          return result;
        }

        /**
         * 移除指定标识的窗口
         * @param uiId         窗口唯一标识
         * @param isDestroy    移除后是否释放
         * @example
         * oops.gui.remove(UIID.Loading);
         */
        remove(uiId, isDestroy) {
          var config = this.configs[uiId];
          if (config == null) {
            warn(`删除编号为【${uiId}】的界面失败，配置信息不存在`);
            return;
          }
          switch (config.layer) {
            case LayerType.UI:
              this.ui.remove(config.prefab, isDestroy);
              break;
            case LayerType.PopUp:
              this.popup.remove(config.prefab, isDestroy);
              break;
            case LayerType.Dialog:
              this.dialog.remove(config.prefab, isDestroy);
              break;
            case LayerType.System:
              this.system.remove(config.prefab, isDestroy);
              break;
          }
        }

        /**
         * 删除一个通过this框架添加进来的节点
         * @param node          窗口节点
         * @param isDestroy     移除后是否释放资源
         * @example
         * oops.gui.removeByNode(cc.Node);
         */
        removeByNode(node, isDestroy) {
          if (node instanceof Node) {
            let comp = node.getComponent(DelegateComponent);
            if (comp && comp.vp) {
              // 释放显示的界面
              if (node.parent) {
                node.parent.remove(comp.vp.config.prefab, isDestroy);
              }
              // 释放缓存中的界面
              else if (isDestroy) {
                switch (comp.vp.config.layer) {
                  case LayerType.UI:
                    // @ts-ignore 注：不对外使用
                    this.ui.removeCache(comp.vp.config.prefab);
                    break;
                  case LayerType.PopUp:
                    // @ts-ignore 注：不对外使用
                    this.popup.removeCache(comp.vp.config.prefab);
                    break;
                  case LayerType.Dialog:
                    // @ts-ignore 注：不对外使用
                    this.dialog.removeCache(comp.vp.config.prefab);
                    break;
                  case LayerType.System:
                    // @ts-ignore 注：不对外使用
                    this.system.removeCache(comp.vp.config.prefab);
                    break;
                }
              }
            } else {
              warn(`当前删除的node不是通过界面管理器添加到舞台上`);
              node.destroy();
            }
          }
        }

        /**
         * 清除所有窗口
         * @param isDestroy 移除后是否释放
         * @example
         * oops.gui.clear();
         */
        clear(isDestroy = false) {
          this.ui.clear(isDestroy);
          this.popup.clear(isDestroy);
          this.dialog.clear(isDestroy);
          this.system.clear(isDestroy);
        }

        /**
         * 构造函数
         * @param root  界面根节点
         */
        constructor(root) {
          /** 界面根节点 */
          this.root = void 0;
          /** 界面摄像机 */
          this.camera = void 0;
          /** 游戏界面特效层 */
          this.game = void 0;
          /** 新手引导层 */
          this.guide = void 0;
          /** 界面地图 */
          this.uiMap = void 0;
          /** 界面层 */
          this.ui = void 0;
          /** 弹窗层 */
          this.popup = void 0;
          /** 只能弹出一个的弹窗 */
          this.dialog = void 0;
          /** 游戏系统提示弹窗  */
          this.system = void 0;
          /** 消息提示控制器，请使用show方法来显示 */
          this.notify = void 0;
          /** UI配置 */
          this.configs = {};
          this.root = root;
          this.camera = this.root.getComponentInChildren(Camera);
          this.game = this.create_node(LayerType.Game);
          this.ui = new LayerUI(LayerType.UI);
          this.popup = new LayerPopUp(LayerType.PopUp);
          this.dialog = new LayerDialog(LayerType.Dialog);
          this.system = new LayerDialog(LayerType.System);
          this.notify = new LayerNotify(LayerType.Notify);
          this.guide = this.create_node(LayerType.Guide);
          root.addChild(this.game);
          root.addChild(this.ui);
          root.addChild(this.popup);
          root.addChild(this.dialog);
          root.addChild(this.system);
          root.addChild(this.notify);
          root.addChild(this.guide);
        }
        create_node(name) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          var w = node.addComponent(Widget);
          w.isAlignLeft = w.isAlignRight = w.isAlignTop = w.isAlignBottom = true;
          w.left = w.right = w.top = w.bottom = 0;
          w.alignMode = 2;
          w.enabled = true;
          return node;
        }
      }
      exports('LayerManager', LayerManager);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LayerNotify.ts", ['cc', './ViewUtil.ts', './Notify.ts'], function (exports) {
  var cclegacy, Node, Widget, Layers, BlockInputEvents, ViewUtil, Notify;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Widget = module.Widget;
      Layers = module.Layers;
      BlockInputEvents = module.BlockInputEvents;
    }, function (module) {
      ViewUtil = module.ViewUtil;
    }, function (module) {
      Notify = module.Notify;
    }],
    execute: function () {
      cclegacy._RF.push({}, "da14ax+B2xNsL2taQFOh7we", "LayerNotify", undefined);
      const ToastPrefabPath = 'common/prefab/notify';
      const WaitPrefabPath = 'common/prefab/wait';

      /*
       * 滚动消息提示层
       */
      class LayerNotify extends Node {
        constructor(name) {
          super(name);
          /** 游戏运行时永久缓冲资源 */
          this.wait = null;
          this.black = void 0;
          var widget = this.addComponent(Widget);
          widget.isAlignLeft = widget.isAlignRight = widget.isAlignTop = widget.isAlignBottom = true;
          widget.left = widget.right = widget.top = widget.bottom = 0;
          widget.alignMode = 2;
          widget.enabled = true;
          this.init();
        }
        init() {
          this.layer = Layers.Enum.UI_2D;
          this.black = this.addComponent(BlockInputEvents);
          this.black.enabled = false;
        }

        /** 打开等待提示 */
        waitOpen() {
          if (this.wait == null) this.wait = ViewUtil.createPrefabNode(WaitPrefabPath);
          if (this.wait.parent == null) {
            this.wait.parent = this;
            this.black.enabled = true;
          }
        }

        /** 关闭等待提示 */
        waitClose() {
          if (this.wait.parent) {
            this.wait.parent = null;
            this.black.enabled = false;
          }
        }

        /**
         * 渐隐飘过提示
         * @param content 文本表示
         * @param useI18n 是否使用多语言
         */
        toast(content, useI18n) {
          let childNode = ViewUtil.createPrefabNode(ToastPrefabPath);
          let toastCom = childNode.getComponent(Notify);
          childNode.parent = this;
          toastCom.toast(content, useI18n);
        }
      }
      exports('LayerNotify', LayerNotify);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LayerPopup.ts", ['cc', './ViewUtil.ts', './LayerUI.ts'], function (exports) {
  var cclegacy, Layers, BlockInputEvents, Node, ViewUtil, LayerUI;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Layers = module.Layers;
      BlockInputEvents = module.BlockInputEvents;
      Node = module.Node;
    }, function (module) {
      ViewUtil = module.ViewUtil;
    }, function (module) {
      LayerUI = module.LayerUI;
    }],
    execute: function () {
      cclegacy._RF.push({}, "25d07BQBCFADaSsh/I3GrTX", "LayerPopup", undefined);
      const Mask = 'common/prefab/mask';

      /* 弹窗层，允许同时弹出多个窗口 */
      class LayerPopUp extends LayerUI {
        constructor(name) {
          super(name);
          /** 触摸事件阻挡 */
          this.black = void 0;
          /** 半透明遮罩资源 */
          this.mask = void 0;
          this.init();
        }
        init() {
          this.layer = Layers.Enum.UI_2D;
          this.black = this.addComponent(BlockInputEvents);
          this.black.enabled = false;
        }
        showUi(vp) {
          super.showUi(vp);

          // 界面加载完成显示时，启动触摸非窗口区域关闭
          this.openVacancyRemove(vp.config);

          // 界面加载完成显示时，层级事件阻挡
          this.black.enabled = true;
        }
        onHide(vp) {
          super.onHide(vp);

          // 界面关闭后，关闭触摸事件阻挡、关闭触摸非窗口区域关闭、关闭遮罩
          this.setBlackDisable();
        }

        /** 设置触摸事件阻挡 */
        setBlackDisable() {
          // 所有弹窗关闭后，关闭事件阻挡功能
          if (this.ui_nodes.size == 0) {
            this.black.enabled = false;
          }
          this.closeVacancyRemove();
          this.closeMask();
        }

        /** 关闭遮罩 */
        closeMask() {
          var flag = true;
          for (var value of this.ui_nodes.values()) {
            if (value.config.mask) {
              flag = false;
              break;
            }
          }
          if (flag) {
            this.mask.parent = null;
          }
        }

        /** 启动触摸非窗口区域关闭 */
        openVacancyRemove(config) {
          if (!this.hasEventListener(Node.EventType.TOUCH_END, this.onTouchEnd, this)) {
            this.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          }

          // 背景半透明遮罩
          if (this.mask == null) {
            this.mask = ViewUtil.createPrefabNode(Mask);
          }
          if (config.mask) {
            this.mask.parent = this;
            this.mask.setSiblingIndex(0);
          }
        }

        /** 关闭触摸非窗口区域关闭 */
        closeVacancyRemove() {
          var flag = true;
          for (var value of this.ui_nodes.values()) {
            if (value.config.vacancy) {
              flag = false;
              break;
            }
          }
          if (flag && this.hasEventListener(Node.EventType.TOUCH_END, this.onTouchEnd, this)) {
            this.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          }
        }
        onTouchEnd(event) {
          if (event.target === this) {
            this.ui_nodes.forEach(vp => {
              // 关闭已显示的界面
              if (vp.valid && vp.config.vacancy) {
                this.remove(vp.config.prefab, true);
              }
            });
          }
        }
        clear(isDestroy) {
          super.clear(isDestroy);
          this.black.enabled = false;
          this.active = false;
          this.closeVacancyRemove();
          this.closeMask();
        }
      }
      exports('LayerPopUp', LayerPopUp);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LayerUI.ts", ['cc', './Oops.ts', './Defines.ts', './DelegateComponent.ts'], function (exports) {
  var cclegacy, Node, Widget, warn, error, instantiate, oops, ViewParams, DelegateComponent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Widget = module.Widget;
      warn = module.warn;
      error = module.error;
      instantiate = module.instantiate;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      ViewParams = module.ViewParams;
    }, function (module) {
      DelegateComponent = module.DelegateComponent;
    }],
    execute: function () {
      cclegacy._RF.push({}, "bc8b86Br9dGeKxeLijkyJKE", "LayerUI", undefined);
      /** 界面层对象 */
      class LayerUI extends Node {
        /**
         * UI基础层，允许添加多个预制件节点
         * @param name 该层名
         * @param container 容器Node
         */
        constructor(name) {
          super(name);
          /** 显示界面节点集合 */
          this.ui_nodes = new Map();
          /** 被移除的界面缓存数据 */
          this.ui_cache = new Map();
          var widget = this.addComponent(Widget);
          widget.isAlignLeft = widget.isAlignRight = widget.isAlignTop = widget.isAlignBottom = true;
          widget.left = widget.right = widget.top = widget.bottom = 0;
          widget.alignMode = 2;
          widget.enabled = true;
        }

        /**
         * 添加一个预制件节点到层容器中，该方法将返回一个唯一`uuid`来标识该操作节点
         * @param prefabPath 预制件路径
         * @param params     自定义参数
         * @param callbacks  回调函数对象，可选
         * @returns ture为成功,false为失败
         */
        add(config, params, callbacks) {
          if (this.ui_nodes.has(config.prefab)) {
            warn(`路径为【${config.prefab}】的预制重复加载`);
            return;
          }

          // 检查缓存中是否存界面
          var vp = this.ui_cache.get(config.prefab);
          if (vp == null) {
            vp = new ViewParams();
            vp.config = config;
          }
          this.ui_nodes.set(config.prefab, vp);
          vp.params = params ?? {};
          vp.callbacks = callbacks ?? {};
          vp.valid = true;
          this.load(vp, config.bundle);
        }

        /**
         * 加载界面资源
         * @param vp         显示参数
         * @param bundle     远程资源包名，如果为空就是默认本地资源包
         */
        load(vp, bundle) {
          if (vp && vp.node) {
            this.showUi(vp);
          } else {
            // 优先加载配置的指定资源包中资源，如果没配置则加载默认资源包资源
            bundle = bundle || oops.res.defaultBundleName;
            oops.res.load(bundle, vp.config.prefab, (err, res) => {
              if (err) {
                this.ui_nodes.delete(vp.config.prefab);
                error(`路径为【${vp.config.prefab}】的预制加载失败`);
                return;
              }
              let childNode = instantiate(res);
              vp.node = childNode;
              let comp = childNode.addComponent(DelegateComponent);
              comp.vp = vp;
              comp.onHide = this.onHide.bind(this);
              this.showUi(vp);
            });
          }
        }
        onHide(vp) {
          this.ui_nodes.delete(vp.config.prefab);
        }

        /**
         * 创建界面节点
         * @param vp  视图参数
         */
        showUi(vp) {
          // 触发窗口添加事件
          let comp = vp.node.getComponent(DelegateComponent);
          comp.add();
          vp.node.parent = this;

          // 标记界面为使用状态
          vp.valid = true;
        }

        /**
         * 根据预制件路径删除，预制件如在队列中也会被删除，如果该预制件存在多个也会一起删除
         * @param prefabPath   预制路径
         * @param isDestroy    移除后是否释放
         */
        remove(prefabPath, isDestroy) {
          var release = undefined;
          if (isDestroy !== undefined) release = isDestroy;

          // 界面移出舞台
          var vp = this.ui_nodes.get(prefabPath);
          if (vp) {
            // 优先使用参数中控制的释放条件，如果未传递参数则用配置中的释放条件
            if (release === undefined && vp.config.destroy !== undefined) {
              release = vp.config.destroy;
            }
            // 默认不缓存关闭的界面
            else {
              release = true;
            }

            // 不释放界面，缓存起来待下次使用
            if (release === false) {
              this.ui_cache.set(vp.config.prefab, vp);
            }
            var childNode = vp.node;
            var comp = childNode.getComponent(DelegateComponent);
            comp.remove(release);
          }

          // 验证是否删除后台缓存界面
          if (release === true) this.removeCache(prefabPath);
        }

        /** 删除缓存的界面，当缓存界面被移除舞台时，可通过此方法删除缓存界面 */
        removeCache(prefabPath) {
          let vp = this.ui_cache.get(prefabPath);
          if (vp) {
            this.ui_nodes.delete(vp.config.prefab);
            this.ui_cache.delete(prefabPath);
            var childNode = vp.node;
            childNode.destroy();
          }
        }

        /**
         * 根据预制路径获取已打开界面的节点对象
         * @param prefabPath  预制路径
         */
        get(prefabPath) {
          var vp = this.ui_nodes.get(prefabPath);
          if (vp) return vp.node;
          return null;
        }

        /**
         * 判断当前层是否包含 uuid或预制件路径对应的Node节点
         * @param prefabPath 预制件路径或者UUID
         */
        has(prefabPath) {
          return this.ui_nodes.has(prefabPath);
        }

        /**
         * 清除所有节点，队列当中的也删除
         * @param isDestroy  移除后是否释放
         */
        clear(isDestroy) {
          // 清除所有显示的界面
          this.ui_nodes.forEach((value, key) => {
            this.remove(value.config.prefab, isDestroy);
            value.valid = false;
          });
          this.ui_nodes.clear();

          // 清除缓存中的界面
          if (isDestroy) {
            this.ui_cache.forEach((value, prefabPath) => {
              this.removeCache(prefabPath);
            });
          }
        }
      }
      exports('LayerUI', LayerUI);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LayerUtil.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b7a864Zpb5N4Zm7onWE1i9D", "LayerUtil", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-09-01 18:00:28
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-02 12:05:38
       */
      /** 游戏摄像机层数据 */
      class LayerItem {
        get value() {
          return this._value;
        }
        get name() {
          return this._name;
        }
        get mask() {
          return 1 << this._value;
        }
        constructor(value, name) {
          this._value = void 0;
          this._name = void 0;
          this._value = value;
          this._name = name;
        }
      }
      exports('LayerItem', LayerItem);

      /***
       * 游戏摄像机层管理工具
       */
      class LayerUtil {
        /**
         * 设置节点层
         * @param item 层数据
         * @param node 节点
         */
        static setNodeLayer(item, node) {
          node.layer = item.mask;
          node.children.forEach(n => {
            n.layer = item.mask;
            LayerUtil.setNodeLayer(item, n);
          });
        }
      }
      exports('LayerUtil', LayerUtil);
      /** 地图对象层 */
      LayerUtil.MAP = new LayerItem(0, 'MAP');
      /** 替身对象层 */
      LayerUtil.AVATAR = new LayerItem(1, 'AVATAR');
      LayerUtil.IGNORE_RAYCAST = new LayerItem(20, 'IGNORE_RAYCAST');
      LayerUtil.GIZMOS = new LayerItem(21, 'GIZMOS');
      /** 编辑器对象层 */
      LayerUtil.EDITOR = new LayerItem(22, 'EDITOR');
      /** 三维对象层 */
      LayerUtil.UI_3D = new LayerItem(23, 'UI_3D');
      LayerUtil.SCENE_GIZMO = new LayerItem(24, 'SCENE_GIZMO');
      /** 二维对象层 */
      LayerUtil.UI_2D = new LayerItem(25, 'UI_2D');
      /** 引擎分析工具层 */
      LayerUtil.PROFILTER = new LayerItem(28, 'PROFILTER');
      /** 默认对象层 */
      LayerUtil.DEFAULT = new LayerItem(30, 'DEFAULT');
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/List.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f4d36IVkDZEFYGJyOy6wiZw", "List", undefined);
      /** 列表 */
      class List {
        constructor(only = true) {
          this.element = void 0;
          /** 是否保证元素的唯一性 */
          this.only = false;
          /** 元素数量(内部再增删时会修改这个参数，外部只做计算和绑定使用，切记不可做赋值操作) */
          this.count = 0;
          this.only = only;
          this.element = [];
        }

        /**
         * 添加到末尾(注意如果保证唯一性，那么重复时就直接返回)
         * @param value 
         */
        push(value) {
          if (this.only) {
            let index = this.element.indexOf(value);
            if (index >= 0) {
              return false;
            }
          }
          this.element.push(value);
          this.count = this.element.length;
          return true;
        }

        /**
         * 添加到列表头部(注意如果保证唯一性，那么重复时就直接返回)
         * @param value 
         * @returns 
         */
        unshift(value) {
          if (this.only) {
            let index = this.element.indexOf(value);
            if (index >= 0) {
              return false;
            }
          }
          this.element.unshift(value);
          this.count = this.element.length;
          return true;
        }

        /**
         * 获取并删除最后一个元素
         * @returns 
         */
        pop() {
          if (this.element.length > 0) {
            const result = this.element.pop();
            this.count = this.element.length;
            return result;
          }
          return null;
        }

        /**
         * 获取并删除第一个元素
         * @returns 
         */
        shift() {
          if (this.element.length > 0) {
            const result = this.element.shift();
            this.count = this.element.length;
            return result;
          }
          return null;
        }

        /**
         * 删除指定索引的元素
         * @param index 
         */
        removeAt(index) {
          if (index >= this.element.length) {
            throw new Error("删除索引超出范围！");
          }
          const result = this.element[index];
          this.element.splice(index, 1);
          this.count = this.element.length;
          return result;
        }

        /**
         * 删除元素
         * @param value 
         */
        remove(value) {
          let index = this.element.indexOf(value);
          if (index < 0) {
            throw new Error("要删除的内容不在列表中！" + value);
          }
          const result = this.element[index];
          this.element.splice(index, 1);
          this.count = this.element.length;
        }

        /** 移除所有元素 */
        clear() {
          this.count = 0;
          this.element.length = 0;
        }

        /**
         * 判断是否包含
         * @param value 
         * @returns 
         */
        has(value) {
          return this.find(value) >= 0;
        }

        /**
         * 查找元素下标
         * @param value 
         * @returns 
         */
        find(value) {
          return this.element.indexOf(value);
        }

        /**
         * 查找元素下标
         * @param predicate 
         * @returns 
         */
        findIndex(predicate) {
          let index = this.element.findIndex(predicate);
          return index;
        }

        /**
         * 获取指定元素
         * @param index 
         * @returns 
         */
        get(index) {
          if (index >= this.element.length) {
            throw new Error("超出索引范围:" + index + "/" + this.element.length);
          }
          return this.element[index];
        }

        /**
         * 源列表数据(注意不要直接进行增删操作，而是通过List.push....等接口进行操作)
         */
        get elements() {
          return this.element;
        }
      }
      exports('List', List);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LoadingIndicator.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "95143M/82NCOLKGzw14JlmS", "LoadingIndicator", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 加载延时提示动画 */
      let LoadingIndicator = exports('LoadingIndicator', (_dec = ccclass("LoadingIndicator"), _dec2 = property(Node), _dec(_class = (_class2 = class LoadingIndicator extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "loading", _descriptor, this);
          this.loading_rotate = 0;
        }
        update(dt) {
          this.loading_rotate += dt * 220;
          this.loading.setRotationFromEuler(0, 0, -this.loading_rotate % 360);
          if (this.loading_rotate > 360) {
            this.loading_rotate -= 360;
          }
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "loading", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LoadingViewComp.ts", ['cc', './Oops.ts', './JsonUtil.ts', './ECS.ts', './CCVMParentComp.ts', './GameEvent.ts', './GameUIConfig.ts', './SingletonModuleComp.ts', './TableRoleJob.ts', './TableRoleLevelUp.ts'], function (exports) {
  var cclegacy, sys, _decorator, oops, JsonUtil, ecs, CCVMParentComp, GameEvent, UIID, smc, TableRoleJob, TableRoleLevelUp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      JsonUtil = module.JsonUtil;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      CCVMParentComp = module.CCVMParentComp;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      smc = module.smc;
    }, function (module) {
      TableRoleJob = module.TableRoleJob;
    }, function (module) {
      TableRoleLevelUp = module.TableRoleLevelUp;
    }],
    execute: function () {
      var _dec, _dec2, _class;
      cclegacy._RF.push({}, "92429ykTnxFCrcGyW58JWjj", "LoadingViewComp", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 游戏资源加载 */
      let LoadingViewComp = exports('LoadingViewComp', (_dec = ccclass('LoadingViewComp'), _dec2 = ecs.register('LoadingView', false), _dec(_class = _dec2(_class = class LoadingViewComp extends CCVMParentComp {
        constructor(...args) {
          super(...args);
          /** VM 组件绑定数据 */
          this.data = {
            /** 加载资源当前进度 */
            finished: 0,
            /** 加载资源最大进度 */
            total: 0,
            /** 加载资源进度比例值 */
            progress: "0",
            /** 加载流程中提示文本 */
            prompt: ""
          };
          this.progress = 0;
        }
        reset() {
          setTimeout(() => {
            // 关闭加载界面
            oops.gui.remove(UIID.Loading);

            // 打开游戏主界面（自定义逻辑）
            oops.gui.open(UIID.Demo);
          }, 500);
        }
        start() {
          if (!sys.isNative) {
            this.enter();
          }
        }
        enter() {
          this.addEvent();
          this.loadRes();
        }
        addEvent() {
          this.on(GameEvent.LoginSuccess, this.onHandler, this);
        }
        onHandler(event, args) {
          switch (event) {
            case GameEvent.LoginSuccess:
              // 加载流程结束，移除加载提示界面
              this.ent.remove(LoadingViewComp);
              break;
          }
        }

        /** 加载资源 */
        async loadRes() {
          this.data.progress = 0;
          await this.loadCustom();
          this.loadGameRes();
        }

        /** 加载游戏本地JSON数据（自定义内容） */
        loadCustom() {
          // 加载游戏本地JSON数据的多语言提示文本
          this.data.prompt = oops.language.getLangByID("loading_load_json");
          return new Promise(async (resolve, reject) => {
            await JsonUtil.loadAsync(TableRoleJob.TableName);
            await JsonUtil.loadAsync(TableRoleLevelUp.TableName);
            resolve(null);
          });
        }

        /** 加载初始游戏内容资源 */
        loadGameRes() {
          // 加载初始游戏内容资源的多语言提示文本
          this.data.prompt = oops.language.getLangByID("loading_load_game");
          oops.res.loadDir("game", this.onProgressCallback.bind(this), this.onCompleteCallback.bind(this));
        }

        /** 加载进度事件 */
        onProgressCallback(finished, total, item) {
          this.data.finished = finished;
          this.data.total = total;
          var progress = finished / total;
          if (progress > this.progress) {
            this.progress = progress;
            this.data.progress = (progress * 100).toFixed(2);
          }
        }

        /** 加载完成事件 */
        onCompleteCallback() {
          // 获取用户信息的多语言提示文本
          this.data.prompt = oops.language.getLangByID("loading_load_player");

          // 初始化帐号模块
          smc.account.connect();
        }
      }) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Logger.ts", ['cc'], function (exports) {
  var cclegacy, log;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      log = module.log;
    }],
    execute: function () {
      cclegacy._RF.push({}, "479cdJANP5KaJgU+8z0DdSE", "Logger", undefined);

      /** 日志类型 */
      let LogType = exports('LogType', /*#__PURE__*/function (LogType) {
        LogType[LogType["Net"] = 1] = "Net";
        LogType[LogType["Model"] = 2] = "Model";
        LogType[LogType["Business"] = 4] = "Business";
        LogType[LogType["View"] = 8] = "View";
        LogType[LogType["Config"] = 16] = "Config";
        LogType[LogType["Trace"] = 32] = "Trace";
        return LogType;
      }({}));
      var names = {
        "1": "网络日志",
        "2": "数据日志",
        "4": "业务日志",
        "8": "视图日志",
        "16": "配置日志",
        "32": "标准日志"
      };

      /** 
       * 日志管理 
       * @example
      oops.log.trace("默认标准日志");
      oops.log.logConfig("灰色配置日志");
      oops.log.logNet("橙色网络日志");
      oops.log.logModel("紫色数据日志");
      oops.log.logBusiness("蓝色业务日志");
      oops.log.logView("绿色视图日志");
       */
      class Logger {
        static init() {
          this.tags = LogType.Net | LogType.Model | LogType.Business | LogType.View | LogType.Config | LogType.Trace;
        }

        /** 
         * 设置显示的日志类型，默认值为不显示任何类型日志
         * @example
        oops.log.setTags(LogType.View|LogType.Business)
         */
        static setTags(tag = null) {
          if (tag) {
            this.tags = tag;
          }
        }

        /**
         * 记录开始计时
         * @param describe  标题描述
         * @example
        oops.log.start();
        ...
        省略N行代码
        ...
        oops.log.end();
         */
        static start(describe = "Time") {
          console.time(describe);
        }

        /**
         * 打印范围内时间消耗
         * @param describe  标题描述
         * @example
        oops.log.start();
        ...
        省略N行代码
        ...
        oops.log.end();
         */
        static end(describe = "Time") {
          console.timeEnd(describe);
        }

        /**
         * 打印表格
         * @param msg       日志消息
         * @param describe  标题描述
         * @example
        var object:any = {uid:1000, name:"oops"};
        oops.log.table(object);
         */
        static table(msg, describe) {
          if (!this.isOpen(LogType.Trace)) {
            return;
          }
          console.table(msg);
        }

        /**
         * 打印标准日志
         * @param msg       日志消息
         */
        static trace(msg, color = "color:#ffffff;") {
          // 标记没有打开，不打印该日志
          if (!this.isOpen(LogType.Trace)) {
            return;
          }
          var backLog = console.log || log;
          backLog.call(null, "%c%s%s", color, this.getDateString(), msg);
        }

        /**
         * 打印网络层日志
         * @param msg       日志消息
         * @param describe  标题描述
         */
        static logNet(msg, describe) {
          this.orange(LogType.Net, msg, describe);
        }

        /**
         * 打印数据层日志
         * @param msg       日志消息
         * @param describe  标题描述
         */
        static logModel(msg, describe) {
          this.violet(LogType.Model, msg, describe);
        }

        /**
         * 打印业务层日志
         * @param msg       日志消息
         * @param describe  标题描述
         */
        static logBusiness(msg, describe) {
          this.blue(LogType.Business, msg, describe);
        }

        /**
         * 打印视图日志
         * @param msg       日志消息
         * @param describe  标题描述
         */
        static logView(msg, describe) {
          this.green(LogType.View, msg, describe);
        }

        /** 打印配置日志 */
        static logConfig(msg, describe) {
          this.gray(LogType.Config, msg, describe);
        }

        // 橙色
        static orange(tag, msg, describe) {
          this.print(tag, msg, "color:#ee7700;", describe);
        }

        // 紫色
        static violet(tag, msg, describe) {
          this.print(tag, msg, "color:Violet;", describe);
        }

        // 蓝色
        static blue(tag, msg, describe) {
          this.print(tag, msg, "color:#3a5fcd;", describe);
        }

        // 绿色
        static green(tag, msg, describe) {
          this.print(tag, msg, "color:green;", describe);
        }

        // 灰色
        static gray(tag, msg, describe) {
          this.print(tag, msg, "color:gray;", describe);
        }
        static isOpen(tag) {
          return (this.tags & tag) != 0;
        }

        /**
         * 输出日志
         * @param tag       日志类型
         * @param msg       日志内容
         * @param color     日志文本颜色
         * @param describe  日志标题描述
         */
        static print(tag, msg, color, describe) {
          // 标记没有打开，不打印该日志
          if (!this.isOpen(tag)) {
            return;
          }
          var backLog = console.log || log;
          var type = names[tag];
          if (describe) {
            backLog.call(null, "%c%s%s%s:%s%o", color, this.getDateString(), '[' + type + ']', this.stack(5), describe, msg);
          } else {
            backLog.call(null, "%c%s%s%s:%o", color, this.getDateString(), '[' + type + ']', this.stack(5), msg);
          }
        }
        static stack(index) {
          var e = new Error();
          var lines = e.stack.split("\n");
          var result = [];
          lines.forEach(line => {
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
              result.push(lineBreak[0]);
            } else {
              result.push({
                [lineBreak[0]]: lineBreak[1]
              });
            }
          });
          var list = [];
          var splitList = [];
          if (index < result.length - 1) {
            var value;
            for (var a in result[index]) {
              var splitList = a.split(".");
              if (splitList.length == 2) {
                list = splitList.concat();
              } else {
                value = result[index][a];
                var start = value.lastIndexOf("/");
                var end = value.lastIndexOf(".");
                if (start > -1 && end > -1) {
                  var r = value.substring(start + 1, end);
                  list.push(r);
                } else {
                  list.push(value);
                }
              }
            }
          }
          if (list.length == 1) {
            return "[" + list[0] + ".ts]";
          } else if (list.length == 2) {
            return "[" + list[0] + ".ts->" + list[1] + "]";
          }
          return "";
        }
        static getDateString() {
          let d = new Date();
          let str = d.getHours().toString();
          let timeStr = "";
          timeStr += (str.length == 1 ? "0" + str : str) + ":";
          str = d.getMinutes().toString();
          timeStr += (str.length == 1 ? "0" + str : str) + ":";
          str = d.getSeconds().toString();
          timeStr += (str.length == 1 ? "0" + str : str) + ":";
          str = d.getMilliseconds().toString();
          if (str.length == 1) str = "00" + str;
          if (str.length == 2) str = "0" + str;
          timeStr += str;
          timeStr = "[" + timeStr + "]";
          return timeStr;
        }
      }
      exports('Logger', Logger);

      // @ts-ignore
      Logger.tags = 0;
      Logger.init();
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./debug-view-runtime-control.ts', './Main4.ts', './Main3.ts', './Main5.ts', './Main2.ts', './Main6.ts', './Pop.ts', './Main.ts', './Account.ts', './AccountNetData.ts', './AccountModelComp.ts', './BundleConfig.ts', './BundleManager.ts', './GameEvent.ts', './GameResPath.ts', './GameUIConfig.ts', './SingletonModuleComp.ts', './EcsPositionSystem.ts', './MoveTo2.ts', './NetChannelManager.ts', './NetConfig.ts', './NetGameTips.ts', './NetNodeGame.ts', './TipsManager.ts', './TableLanguage.ts', './TablePromptWindow.ts', './TableRoleJob.ts', './TableRoleLevelUp.ts', './Demo.ts', './Initialize.ts', './InitRes.ts', './Hot.ts', './HotUpdate.ts', './LoadingViewComp.ts', './Role.ts', './RoleEvent.ts', './RoleChangeJob.ts', './RoleUpgrade.ts', './RoleEnum.ts', './RoleModelBaseComp.ts', './RoleModelComp.ts', './RoleModelJobComp.ts', './RoleModelLevelComp.ts', './RoleNumeric.ts', './RoleNumericMap.ts', './RoleViewAnimator.ts', './RoleViewComp.ts', './RoleViewController.ts', './RoleViewInfoComp.ts', './RoleViewLoader.ts', './AnimationEventHandler.ts', './RoleStateAttack.ts', './RoleStateDead.ts', './RoleStateHit.ts', './Oops.ts', './Root.ts', './AudioEffect.ts', './AudioManager.ts', './AudioMusic.ts', './EventDispatcher.ts', './EventMessage.ts', './MessageManager.ts', './ResLoader.ts', './ZipLoader.ts', './Logger.ts', './RandomManager.ts', './StorageManager.ts', './Timer.ts', './TimerManager.ts', './ArrayExt.ts', './DateExt.ts', './DirectorExt.ts', './NodeDragExt.ts', './NodeExt.ts', './GameManager.ts', './GUI.ts', './Defines.ts', './DelegateComponent.ts', './LayerDialog.ts', './LayerManager.ts', './LayerNotify.ts', './LayerPopup.ts', './LayerUI.ts', './UIMap.ts', './CommonPrompt.ts', './LoadingIndicator.ts', './Notify.ts', './ArrayUtil.ts', './CameraUtil.ts', './EncryptUtil.ts', './ImageUtil.ts', './JsonUtil.ts', './LayerUtil.ts', './MathUtil.ts', './ObjectUtil.ts', './PhysicsUtil.ts', './PlatformUtil.ts', './RegexUtil.ts', './RotateUtil.ts', './StringUtil.ts', './TimeUtils.ts', './Vec3Util.ts', './ViewUtil.ts', './Ambilight.ts', './FlashSpine.ts', './FlashSprite.ts', './SpineFinishedRelease.ts', './NavLine.ts', './DrawMeshSector.ts', './Effect2DFollow3D.ts', './EffectDelayRelease.ts', './EffectEvent.ts', './EffectFinishedRelease.ts', './EffectSingleCase.ts', './MoveRigidBody.ts', './MoveTo.ts', './MoveTranslate.ts', './AnimatorAnimation.ts', './AnimatorCustomization.ts', './AnimatorDragonBones.ts', './AnimatorSkeletal.ts', './AnimatorSpine.ts', './AnimatorSpineSecondary.ts', './AnimatorBase.ts', './AnimatorCondition.ts', './AnimatorController.ts', './AnimatorParams.ts', './AnimatorState.ts', './AnimatorStateLogic.ts', './AnimatorTransition.ts', './BTreeNode.ts', './BehaviorTree.ts', './BranchNode.ts', './Decorator.ts', './IControl.ts', './Priority.ts', './Selector.ts', './Sequence.ts', './Task.ts', './index.ts', './FreeFlightCamera.ts', './OrbitCamera.ts', './AsyncQueue.ts', './Collection.ts', './List.ts', './ECS.ts', './ECSComp.ts', './ECSEntity.ts', './ECSGroup.ts', './ECSMask.ts', './ECSMatcher.ts', './ECSModel.ts', './ECSSystem.ts', './Badge.ts', './RoundRectMask.ts', './ButtonEffect.ts', './ButtonSimple.ts', './ButtonTouchLong.ts', './LabelChange.ts', './LabelNumber.ts', './LabelTime.ts', './Language.ts', './LanguageData.ts', './LanguageLabel.ts', './LanguagePack.ts', './LanguageSpine.ts', './LanguageSprite.ts', './JsonOb.ts', './StringFormat.ts', './VMBase.ts', './VMCompsEdit.ts', './VMCustom.ts', './VMEnv.ts', './VMEvent.ts', './VMLabel.ts', './VMModify.ts', './VMParent.ts', './VMProgress.ts', './VMState.ts', './ViewModel.ts', './BhvButtonGroup.ts', './BhvFrameIndex.ts', './BhvRollNumber.ts', './BhvSwitchPage.ts', './HttpRequest.ts', './NetInterface.ts', './NetManager.ts', './NetNode.ts', './NetProtocolPako.ts', './NetProtocolProtobuf.ts', './WebSock.ts', './pako.min.mjs_cjs=&original=.js', './RtToModel.ts', './RtToSprite.ts', './CCComp.ts', './CCVMParentComp.ts', './GameCollision.ts', './GameComponent.ts', './ModuleUtil.ts', './BuildTimeConstants.ts', './Config.ts', './GameConfig.ts', './GameQueryConfig.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/Main.ts", ['cc', './Oops.ts', './Root.ts', './ECS.ts', './GameUIConfig.ts', './SingletonModuleComp.ts', './EcsPositionSystem.ts', './Initialize.ts'], function (exports) {
  var cclegacy, macro, DynamicAtlasManager, profiler, _decorator, oops, Root, ecs, UIConfigData, smc, EcsPositionSystem, Initialize;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      macro = module.macro;
      DynamicAtlasManager = module.DynamicAtlasManager;
      profiler = module.profiler;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      Root = module.Root;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      UIConfigData = module.UIConfigData;
    }, function (module) {
      smc = module.smc;
    }, function (module) {
      EcsPositionSystem = module.EcsPositionSystem;
    }, function (module) {
      Initialize = module.Initialize;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "0eec0s4qrZF7onPlYBrD+y+", "Main", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      macro.CLEANUP_IMAGE_CACHE = false;
      DynamicAtlasManager.instance.enabled = true;
      DynamicAtlasManager.instance.maxFrameSize = 512;
      let Main = exports('Main', (_dec = ccclass('Main'), _dec(_class = class Main extends Root {
        start() {
          profiler.showStats();
        }
        run() {
          smc.initialize = ecs.getEntity(Initialize);
          {
            oops.gui.toast("热更新后新程序的提示");
          }
        }
        initGui() {
          oops.gui.init(UIConfigData);
        }
        async initEcsSystem() {
          oops.ecs.add(new EcsPositionSystem());
          // oops.ecs.add(new EcsAccountSystem());
          // oops.ecs.add(new EcsRoleSystem());
          // oops.ecs.add(new EcsInitializeSystem());
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Main2.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Oops.ts', './Root.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Sprite, SpriteFrame, Texture2D, oops, Root;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      SpriteFrame = module.SpriteFrame;
      Texture2D = module.Texture2D;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      Root = module.Root;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "11548+V3I1AtaJD2OpHN6V5", "Main", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 
       * 资源管理模块功能演示 oops-framework/assets/core/common/loader  
       * 远程资源其它类型加载可参考 https://docs.cocos.com/creator/manual/zh/asset/dynamic-load-resources.html?h=loadremote
       * SPINE资源加载可参考 https://docs.cocos.com/creator/manual/zh/asset/spine.html?h=loadany
       */
      let Main = exports('Main', (_dec = ccclass('Main'), _dec2 = property({
        type: Node
      }), _dec(_class = (_class2 = class Main extends Root {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "sprite", _descriptor, this);
          this.url = "https://oops-1255342636.cos-website.ap-shanghai.myqcloud.com/img/bg.png";
        }
        // private cache: any = {};

        btnLoader() {
          var opt = {
            ext: ".png"
          };
          var onComplete = (err, data) => {
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = data;
            spriteFrame.texture = texture;
            var sprite = this.sprite.getComponent(Sprite) || this.sprite.addComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
            data.addRef();
            // this.cache[data.nativeUrl] = spriteFrame;
          };

          oops.res.loadRemote(this.url, opt, onComplete);
        }
        btnUnLoader() {
          const sprite = this.sprite.getComponent(Sprite);
          if (sprite && sprite.spriteFrame) {
            const spFrame = sprite.spriteFrame;
            sprite.spriteFrame.decRef();
            sprite.spriteFrame = null;
            if (spFrame.refCount <= 0) {
              let texture = spFrame.texture;
              // 有动态合图时先取原始的Texture2D
              if (spFrame.packable) {
                var _spFrame$original;
                texture = (_spFrame$original = spFrame.original) == null ? void 0 : _spFrame$original._texture;
              }
              if (texture) {
                // delete this.cache[texture.image!.nativeUrl];
                texture.image.decRef();
                texture.destroy();
              }
              spFrame.destroy();
            }
            sprite.destroy();
          }
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "sprite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Main3.ts", ['cc', './Root.ts', './index.ts', './Timer.ts', './BehaviorTree.ts', './Sequence.ts', './Task.ts', './Decorator.ts'], function (exports) {
  var cclegacy, _decorator, Root, Timer, BehaviorTree, Sequence, Task, Decorator;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      Root = module.Root;
    }, null, function (module) {
      Timer = module.Timer;
    }, function (module) {
      BehaviorTree = module.BehaviorTree;
    }, function (module) {
      Sequence = module.Sequence;
    }, function (module) {
      Task = module.Task;
    }, function (module) {
      Decorator = module.Decorator;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "2c1f2/KvoVNAp6GtZQtTX8W", "Main", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 
       * 行为演示
       * 功能说明：一个角色向前移动，如果碰到敌人就停下，如果没有则继续移动
       */
      let Main = exports('Main', (_dec = ccclass('Main'), _dec(_class = class Main extends Root {
        constructor(...args) {
          super(...args);
          /** 角色位置 */
          this.role_pos = 0;
          /** 敌人位置 */
          this.enemy_pos = 3;
          this.bt = null;
          this.timer = new Timer(1);
        }
        start() {
          var btns = [];
          btns.push(new RoleMoveTask());
          btns.push(new IsSeeEnemy(new RoleMoveStopTask()));

          // 这里表达，RoleMoveTask节点先处理角色移动一步，IsSeeEnemy节点验证是否碰到敌人，如果碰到，IsSeeEnemy下面挂的任务节点就处理碰到敌人的提示。
          this.bt = new BehaviorTree(new Sequence(btns));
        }
        update(dt) {
          if (this.timer.update(dt)) {
            this.bt.setObject(this);
            this.bt.run();
          }
        }
      }) || _class));

      /** 演示控制移动，通过行为树黑板的概念把需要处理的Main对象传递到行为树中,每过一秒先移动一步 */
      class RoleMoveTask extends Task {
        run(obj) {
          if (obj) {
            obj.role_pos++;
            console.log(`角色当前移动了【${obj.role_pos}】步`);
          }
          this.success();
        }
      }

      /** 装饰器是条件语句只能附加在其他节点上并且定义所附加的节点是否执行，这里验证比如敌人位置与之相等后，表示条件验证成功,继续执行后续任务，失败结束行为树的处理流程 */
      class IsSeeEnemy extends Decorator {
        run(blackboard) {
          if (blackboard.role_pos >= blackboard.enemy_pos) {
            super.run(blackboard);
            this.success(); // 调用此方法，代表此节点表达验证逻辑为true的结果，可以执行后续节点
          } else {
            this.fail(); // 调用此方法，代表此节点表达验证逻辑为false的结果，不能执行后续节点
          }
        }
      }

      /** 玩家自己停止动作逻辑，这类逻辑一般只会成本，属于确定的流程 */
      class RoleMoveStopTask extends Task {
        run(blackboard) {
          console.log(`角色当前停止移动`);
          blackboard.enabled = false; // 不在触发行为树处理逻辑
          this.success();
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Main4.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Oops.ts', './Root.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Slider, Node, _decorator, oops, Root;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Slider = module.Slider;
      Node = module.Node;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      Root = module.Root;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "68b172688BKGawrwU4Ijt+p", "Main", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 音乐管理模块功能演示 oops-framework/assets/core/common/audio  */
      let Main = exports('Main', (_dec = ccclass('Main'), _dec2 = property({
        type: Slider
      }), _dec3 = property({
        type: Slider
      }), _dec4 = property({
        type: Node
      }), _dec(_class = (_class2 = class Main extends Root {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "sliderMusic", _descriptor, this);
          _initializerDefineProperty(this, "sliderMusicVolume", _descriptor2, this);
          _initializerDefineProperty(this, "sliderMusicHandle", _descriptor3, this);
        }
        start() {
          oops.res.loadDir("common");
          this.sliderMusicHandle.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.sliderMusicHandle.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          this.sliderMusicHandle.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
        onTouchStart() {
          this.enabled = false;
        }
        onTouchEnd() {
          this.enabled = true;

          // 设置背景音乐进度
          oops.audio.progressMusic = this.sliderMusic.progress;
        }
        update(deltaTime) {
          var p = oops.audio.progressMusic;
          if (p > 0) this.sliderMusic.progress = p;
        }

        /** 播放背景音乐 */
        onBtnMusic() {
          // 监听音乐播放完成事件（正常播放完、音乐强制停止时触发）
          oops.audio.setMusicComplete(() => {
            oops.gui.toast("音乐播放完成");
            oops.audio.music.release(); // 释放背景音乐资源
            oops.audio.effect.releaseAll(); // 释放背景音乐资源
            // oops.audio.effect.release("");
          });

          // 播放背景音乐（只需要传递音乐资源地址，框架会自动加载完音乐资源后开始播放音乐）
          oops.audio.playMusic("audios/nocturne");
        }

        /** 暂停当前音乐与音效的播放 */
        onPauseAll() {
          oops.audio.pauseAll();
        }

        /** 恢复当前暂停的音乐与音效播放 */
        onResumeAll() {
          oops.audio.resumeAll();
        }

        /** 停止当前音乐与音效的播放 */
        onStopAll() {
          oops.audio.stopAll();
        }

        /** 调解背景音乐音量 */
        onSliderMusicVolume(slider, customEventData) {
          // 设置背景音乐音量
          oops.audio.volumeMusic = slider.progress;
          // 设置音效音量
          oops.audio.volumeEffect = slider.progress;
        }

        /** 播放音效 */
        onBtnEffect() {
          oops.audio.playEffect("audios/Gravel");
        }

        /** 保存音乐音效的音量、开关配置数据到本地 */
        onBtnSave() {
          oops.audio.save();
        }

        /** 本地加载音乐音效的音量、开关配置数据并设置到游戏中 */
        onBtnLoad() {
          oops.audio.load();
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sliderMusic", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sliderMusicVolume", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "sliderMusicHandle", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Main5.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BundleManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Sprite, _decorator, Component, Prefab, BundleManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      _decorator = module._decorator;
      Component = module.Component;
      Prefab = module.Prefab;
    }, function (module) {
      BundleManager = module.BundleManager;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "bd9e1BycWpCF4gNG1abjYaD", "Main", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let Main = exports('Main', (_dec = ccclass('Main'), _dec2 = property(Sprite), _dec(_class = (_class2 = class Main extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "icon", _descriptor, this);
        }
        start() {
          this.loadAsset();
        }
        async loadAsset() {
          //自己重新传参，享受下代码提示的快感吧
          let res = await BundleManager.loadPrefab("home", "home1");
          console.log("预制体", res);
          let res1 = await BundleManager.loadAudio("home", "music2");
          console.log("音效", res1);
          let res2 = await BundleManager.loadTextre("game", "game1");
          console.log("图片", res2);
          let res3 = await BundleManager.loadAsset("game", "game1", Prefab);
          console.log("loadAsset预制体", res3);
          this.icon.spriteFrame = res2;
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "icon", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Main6.ts", ['cc', './Oops.ts', './Root.ts', './GameUIConfig.ts'], function (exports) {
  var cclegacy, _decorator, tween, Vec3, oops, Root, UIConfigData, UIID;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      tween = module.tween;
      Vec3 = module.Vec3;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      Root = module.Root;
    }, function (module) {
      UIConfigData = module.UIConfigData;
      UIID = module.UIID;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "e0b71XDCbBI4a33C31tD+NR", "Main", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 
       * 游戏多种类窗口功能演示
       * 1、主界面
       * 2、界面切换
       * 3、弹出窗口
       * 4、模式窗口
       * 5、弹出窗口传数据方式
       * 6、弹出窗口动画
       */
      let Main = exports('Main', (_dec = ccclass('Main'), _dec(_class = class Main extends Root {
        initGui() {
          oops.res.loadDir("common");
          oops.gui.init(UIConfigData);
        }
        btnMainUI() {
          oops.gui.open(UIID.MainUI);
        }
        btnSwitch() {
          oops.gui.remove(UIID.MainUI);
          oops.gui.open(UIID.MainUI_Switch);
        }
        btnPop1() {
          oops.gui.open(UIID.Pop1, {
            param: "pop1"
          }, this.getPopCommonEffect());
        }
        btnPop2() {
          oops.gui.open(UIID.Pop2, {
            param: "pop2"
          }, this.getPopCommonEffect());
        }
        btnDialog() {
          var uic = {
            onAdded: (node, params) => {
              console.log("界面添加到父节点后");
            },
            onRemoved: (node, params) => {
              console.log("界面从父节点移除后");
            }
          };
          oops.gui.open(UIID.Dialog, {
            param: "Dialog"
          }, uic);
        }
        getPopCommonEffect(callbacks) {
          let newCallbacks = {
            // 节点添加动画
            onAdded: (node, params) => {
              node.setScale(0.1, 0.1, 0.1);
              tween(node).to(0.2, {
                scale: new Vec3(1, 1, 1)
              }).start();
            },
            // 节点删除动画
            onBeforeRemove: (node, next) => {
              tween(node).to(0.2, {
                scale: new Vec3(0.1, 0.1, 0.1)
              }).call(next).start();
            }
          };
          if (callbacks) {
            if (callbacks && callbacks.onAdded) {
              let onAdded = callbacks.onAdded;
              callbacks.onAdded = (node, params) => {
                onAdded(node, params);
                newCallbacks.onAdded && newCallbacks.onAdded(node, params);
              };
            }
            if (callbacks && callbacks.onBeforeRemove) {
              let onBeforeRemove = callbacks.onBeforeRemove;
              callbacks.onBeforeRemove = (node, params) => {
                onBeforeRemove(node, params);
                newCallbacks.onBeforeRemove && newCallbacks.onBeforeRemove(node, params);
              };
            }
            return callbacks;
          }
          return newCallbacks;
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MathUtil.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8c615ZS4PRMPKPA9ZqKjiJC", "MathUtil", undefined);
      /** 数学工具 */
      class MathUtil {
        /**
         * 获得随机方向
         * @param x -1为左，1为右
         * @returns 
         */
        static sign(x) {
          if (x > 0) {
            return 1;
          }
          if (x < 0) {
            return -1;
          }
          return 0;
        }

        /**
         * 随时间变化进度值
         * @param start 初始值
         * @param end   结束值
         * @param t     时间
         */
        static progress(start, end, t) {
          return start + (end - start) * t;
        }

        /**
         * 插值
         * @param numStart 开始数值
         * @param numEnd   结束数值
         * @param t        时间
         */
        static lerp(numStart, numEnd, t) {
          if (t > 1) {
            t = 1;
          } else if (t < 0) {
            t = 0;
          }
          return numStart * (1 - t) + numEnd * t;
        }

        /**
         * 角度插值
         * @param angle1 角度1
         * @param angle2 角度2
         * @param t      时间
         */
        static lerpAngle(current, target, t) {
          current %= 360;
          target %= 360;
          var dAngle = target - current;
          if (dAngle > 180) {
            target = current - (360 - dAngle);
          } else if (dAngle < -180) {
            target = current + (360 + dAngle);
          }
          return (MathUtil.lerp(current, target, t) % 360 + 360) % 360;
        }

        /**
         * 按一定的速度从一个角度转向令一个角度
         * @param current 当前角度
         * @param target  目标角度
         * @param speed   速度
         */
        static angleTowards(current, target, speed) {
          current %= 360;
          target %= 360;
          var dAngle = target - current;
          if (dAngle > 180) {
            target = current - (360 - dAngle);
          } else if (dAngle < -180) {
            target = current + (360 + dAngle);
          }
          var dir = target - current;
          if (speed > Math.abs(dir)) {
            return target;
          }
          return ((current + speed * Math.sign(dir)) % 360 + 360) % 360;
        }

        /**
         * 获取方位内值，超过时获取对应边界值
         * @param value     值
         * @param minLimit  最小值
         * @param maxLimit  最大值
         */
        static clamp(value, minLimit, maxLimit) {
          if (value < minLimit) {
            return minLimit;
          }
          if (value > maxLimit) {
            return maxLimit;
          }
          return value;
        }

        /**
         * 获得一个值的概率
         * @param value 值
         */
        static probability(value) {
          return Math.random() < value;
        }
      }
      exports('MathUtil', MathUtil);
      /**
       * 角度转弧度
       */
      MathUtil.deg2Rad = Math.PI / 180;
      /**
       * 弧度转角度
       */
      MathUtil.rad2Deg = 180 / Math.PI;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MessageManager.ts", ['cc'], function (exports) {
  var cclegacy, warn, log;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      warn = module.warn;
      log = module.log;
    }],
    execute: function () {
      var _class3;
      cclegacy._RF.push({}, "a401fY+wj9NsqOACoZ7Zy/R", "MessageManager", undefined);
      class EventData {
        constructor() {
          this.event = void 0;
          this.listener = void 0;
          this.object = void 0;
        }
      }

      /**
       * 批量注册、移除全局事件对象
       */
      class MessageEventData {
        constructor() {
          this.events = {};
        }
        /**
         * 注册全局事件
         * @param event      事件名
         * @param listener   处理事件的侦听器函数
         * @param object     侦听函数绑定的作用域对象
         */
        on(event, listener, object) {
          let list = this.events[event];
          if (list == null) {
            list = [];
            this.events[event] = list;
          }
          let data = new EventData();
          data.event = event;
          data.listener = listener;
          data.object = object;
          list.push(data);
          MessageManager.Instance.on(event, listener, object);
        }

        /**
        * 移除全局事件
         * @param event     事件名
         */
        off(event) {
          let ebs = this.events[event];
          if (!ebs) {
            return;
          }
          for (let eb of ebs) {
            MessageManager.Instance.off(event, eb.listener, eb.object);
          }
          delete this.events[event];
        }

        /** 
         * 触发全局事件 
         * @param event(string)      事件名
         * @param args(any)          事件参数
         */
        dispatchEvent(event, arg = null) {
          MessageManager.Instance.dispatchEvent(event, arg);
        }

        /** 清除所有的全局事件监听 */
        clear() {
          for (let event in this.events) {
            this.off(event);
          }
        }
      }
      exports('MessageEventData', MessageEventData);

      /** 
       * 全局消息管理
       * @example 
      // 注册持续监听的全局事件
      export class RoleViewComp extends Component{
          onLoad(){
              // 监听全局事件
              oops.message.on(GameEvent.GameServerConnected, this.onHandler, this);
          }
          
          protected onDestroy() {
              // 对象释放时取消注册的全局事件
              oops.message.off(GameEvent.GameServerConnected, this.onHandler, this);
          }
          
          private onHandler(event: string, args: any) {
              switch (event) {
                  case GameEvent.GameServerConnected:
                      console.log("处理游戏服务器连接成功后的逻辑");
                      break;
              }
          }
      }
        // 注册只触发一次的全局事件
      export class RoleViewComp extends Component{
          onLoad(){
              // 监听一次事件，事件响应后，该监听自动移除
              oops.message.once(GameEvent.GameServerConnected, this.onHandler, this);
          }
          
          private onHandler(event: string, args: any) {
              switch (event) {
                  case GameEvent.GameServerConnected:
                      console.log("处理游戏服务器连接成功后的逻辑");
                      break;
              }
          }
      }
       */
      class MessageManager {
        constructor() {
          this.events = {};
        }
        /**
         * 注册全局事件
         * @param event      事件名
         * @param listener   处理事件的侦听器函数
         * @param object     侦听函数绑定的作用域对象
         */
        on(event, listener, object) {
          if (!event || !listener) {
            warn(`注册【${event}】事件的侦听器函数为空`);
            return;
          }
          let list = this.events[event];
          if (list == null) {
            list = [];
            this.events[event] = list;
          }
          let length = list.length;
          for (let i = 0; i < length; i++) {
            let bin = list[i];
            if (bin.listener == listener && bin.object == object) {
              warn(`名为【${event}】的事件重复注册侦听器`);
            }
          }
          let data = new EventData();
          data.event = event;
          data.listener = listener;
          data.object = object;
          list.push(data);
        }

        /**
         * 监听一次事件，事件响应后，该监听自动移除
         * @param event     事件名
         * @param listener  事件触发回调方法
         * @param object    侦听函数绑定的作用域对象
         */
        once(event, listener, object) {
          let _listener = ($event, $args) => {
            this.off(event, _listener, object);
            _listener = null;
            listener.call(object, $event, $args);
          };
          this.on(event, _listener, object);
        }

        /**
         * 移除全局事件
         * @param event     事件名
         * @param listener  处理事件的侦听器函数
         * @param object    侦听函数绑定的作用域对象
         */
        off(event, listener, object) {
          let list = this.events[event];
          if (!list) {
            log(`名为【${event}】的事件不存在`);
            return;
          }
          let length = list.length;
          for (let i = 0; i < length; i++) {
            let bin = list[i];
            if (bin.listener == listener && bin.object == object) {
              list.splice(i, 1);
              break;
            }
          }
          if (list.length == 0) {
            delete this.events[event];
          }
        }

        /** 
         * 触发全局事件 
         * @param event(string)      事件名
         * @param args(any)          事件参数
         */
        dispatchEvent(event, args = null) {
          let list = this.events[event];
          if (list != null) {
            let temp = list.concat();
            let length = temp.length;
            for (let i = 0; i < length; i++) {
              let eventBin = temp[i];
              eventBin.listener.call(eventBin.object, event, args);
            }
          }
        }
      }
      exports('MessageManager', MessageManager);
      _class3 = MessageManager;
      MessageManager.Instance = new _class3();
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ModuleUtil.ts", ['cc', './Oops.ts', './ViewUtil.ts'], function (exports) {
  var cclegacy, oops, ViewUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      ViewUtil = module.ViewUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "52a6cdAO5tGxaeE1TprZ5VK", "ModuleUtil", undefined);
      class ModuleUtil {
        /**
         * 添加界面组件
         * @param ent      模块实体
         * @param ctor     界面逻辑组件
         * @param uiId     界面资源编号
         * @param uiArgs   界面参数
         */
        static addViewUi(ent, ctor, uiId, uiArgs = null) {
          var uic = {
            onAdded: (node, params) => {
              var comp = node.getComponent(ctor);
              ent.add(comp);
            }
          };
          oops.gui.open(uiId, uiArgs, uic);
        }

        /**
         * 异步添加视图层组件
         * @param ent      模块实体
         * @param ctor     界面逻辑组件
         * @param uiId     界面资源编号
         * @param uiArgs   界面参数
         * @returns 界面节点
         */
        static addViewUiAsync(ent, ctor, uiId, uiArgs = null) {
          return new Promise((resolve, reject) => {
            var uic = {
              onAdded: (node, params) => {
                var comp = node.getComponent(ctor);
                ent.add(comp);
                resolve(node);
              }
            };
            oops.gui.open(uiId, uiArgs, uic);
          });
        }

        /**
         * 业务实体上移除界面组件
         * @param ent        模块实体
         * @param ctor       界面逻辑组件
         * @param uiId       界面资源编号
         * @param isDestroy  是否释放界面缓存
         */
        static removeViewUi(ent, ctor, uiId, isDestroy) {
          ent.remove(ctor);
          oops.gui.remove(uiId, isDestroy);
        }

        /**
        * 添加界面组件
        * @param ent      模块实体
        * @param ctor     界面逻辑组件
        * @param parent   显示对象父级
        * @param url      显示资源地址
        */
        static addView(ent, ctor, parent, url) {
          var node = ViewUtil.createPrefabNode(url);
          var comp = node.getComponent(ctor);
          ent.add(comp);
          node.parent = parent;
        }
      }
      exports('ModuleUtil', ModuleUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MoveRigidBody.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Vec3, _decorator, Component, RigidBody, EPSILON;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
      Component = module.Component;
      RigidBody = module.RigidBody;
      EPSILON = module.EPSILON;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "4e8cedkWeJDEZoUMtauac/M", "MoveRigidBody", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      const v3_0 = new Vec3();
      const v3_1 = new Vec3();

      /** 
       * 物理方式移动
       * 1. 施加线性数度
       * 2. 施加阻尼
       * 3. 施加重力
       * 4. 控制移动速度或速度比率
       */
      let MoveRigidBody = exports('MoveRigidBody', (_dec = ccclass('MoveRigidBody'), _dec2 = property({
        tooltip: '阻尼'
      }), _dec3 = property({
        tooltip: '重力'
      }), _dec4 = property({
        tooltip: '移动速度'
      }), _dec5 = property({
        tooltip: '速度比率'
      }), _dec(_class = (_class2 = class MoveRigidBody extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "damping", _descriptor, this);
          _initializerDefineProperty(this, "gravity", _descriptor2, this);
          _initializerDefineProperty(this, "_speed", _descriptor3, this);
          _initializerDefineProperty(this, "_ratio", _descriptor4, this);
          this._rigidBody = null;
          this._grounded = true;
          // 是否着地
          this._curMaxSpeed = 0;
          // 当前最大速度
          this._prevAngleY = 0;
          // 之前的Y角度值
          this._stateX = 0;
          this._stateZ = 0;
          this._velocity = new Vec3();
        }
        get speed() {
          return this._speed;
        }
        set speed(value) {
          this._speed = value;
          this._curMaxSpeed = value * this.ratio;
        }
        get ratio() {
          return this._ratio;
        }
        set ratio(value) {
          this._ratio = value;
          this._curMaxSpeed = this.speed * value;
        }
        /** 是否着地 */
        get grounded() {
          return this._grounded;
        }
        /** 移动方向 */
        get velocity() {
          return this._velocity;
        }
        set velocity(value) {
          this._velocity = value;
          var x = value.x;
          var z = value.z;
          if (x > 0 && this._stateX < 0 || x < 0 && this._stateX > 0 || z > 0 && this._stateZ < 0 || z < 0 && this._stateZ > 0) {
            this._rigidBody.clearVelocity(); // 当前跟之前方向不一致则清除速度,避免惯性太大
          }

          this._stateX = x;
          this._stateZ = z;
        }
        start() {
          this._rigidBody = this.getComponent(RigidBody);
          this._prevAngleY = this.node.eulerAngles.y;
        }

        /** 刚体停止移动 */
        stop() {
          this._stateX = 0;
          this._stateZ = 0;
          this._rigidBody.clearVelocity(); // 清除移动速度
        }

        update(dt) {
          // 施加重力
          this.applyGravity();

          // 施加阻尼
          this.applyDamping(dt);

          // 未落地无法移动
          if (!this.grounded) return;

          // 施加移动
          this.applyLinearVelocity(v3_0, 1);
        }

        /** 施加重力 */
        applyGravity() {
          const g = this.gravity;
          const m = this._rigidBody.mass;
          v3_1.set(0, m * g, 0);
          this._rigidBody.applyForce(v3_1);
        }

        /** 施加阻尼 */
        applyDamping(dt) {
          // 获取线性速度
          this._rigidBody.getLinearVelocity(v3_1);
          if (v3_1.lengthSqr() > EPSILON) {
            v3_1.multiplyScalar(Math.pow(1.0 - this.damping, dt));
            this._rigidBody.setLinearVelocity(v3_1);
          }
        }

        /**
         * 施加移动
         * @param {Vec3} dir        方向
         * @param {number} speed    移动数度
         */
        applyLinearVelocity(dir, speed) {
          if (this._stateX || this._stateZ) {
            v3_0.set(this._stateX, 0, this._stateZ);
            v3_0.normalize();
            // 获取线性速度
            this._rigidBody.getLinearVelocity(v3_1);
            Vec3.scaleAndAdd(v3_1, v3_1, dir, speed);
            const ms = this._curMaxSpeed;
            const len = v3_1.lengthSqr();
            let ratio = 1;
            if (len > ms) {
              if (Math.abs(this.node.eulerAngles.y - this._prevAngleY) >= 10) {
                ratio = 2;
              }
              this._prevAngleY = this.node.eulerAngles.y;
              v3_1.normalize();
              v3_1.multiplyScalar(ms / ratio);
            }
            this._rigidBody.setLinearVelocity(v3_1);
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "damping", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "gravity", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -10;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_speed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "speed", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "speed"), _class2.prototype), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_ratio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "ratio", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "ratio"), _class2.prototype)), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MoveTo.ts", ['cc', './Timer.ts', './Vec3Util.ts'], function (exports) {
  var cclegacy, Component, Node, Vec3, _decorator, Timer, Vec3Util;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Node = module.Node;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
    }, function (module) {
      Timer = module.Timer;
    }, function (module) {
      Vec3Util = module.Vec3Util;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "5e22a+qWUpI6ZHSVRRj2DYT", "MoveTo", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 移动到指定目标位置 */
      let MoveTo = exports('MoveTo', (_dec = ccclass('MoveTo'), _dec(_class = class MoveTo extends Component {
        constructor(...args) {
          super(...args);
          /** 目标位置 */
          this.target = null;
          /** 移动方向 */
          this.velocity = Vec3Util.zero;
          /** 移动速度（每秒移动的像素距离） */
          this.speed = 0;
          /** 是否计算将 Y 轴带入计算 */
          this.hasYAxis = true;
          /** 坐标标（默认本地坐标） */
          this.ns = Node.NodeSpace.LOCAL;
          /** 偏移距离 */
          this.offset = 0;
          /** 偏移向量 */
          this.offsetVector = null;
          /** 移动开始 */
          this.onStart = null;
          /** 移动完成回调 */
          this.onComplete = null;
          /** 距离变化时 */
          this.onChange = null;
          /** 延时触发器 */
          this.timer = new Timer();
          /** 终点备份 */
          this.end = null;
        }
        update(dt) {
          let end;
          console.assert(this.speed > 0, "移动速度必须要大于零");
          if (this.target instanceof Node) {
            end = this.ns == Node.NodeSpace.WORLD ? this.target.worldPosition : this.target.position;
          } else {
            end = this.target;
          }

          // 移动目标节点被释放时
          if (end == null) {
            this.exit();
            return;
          }

          // 目标移动后，重计算移动方向与移动到目标点的速度
          if (this.end == null || !this.end.strictEquals(end)) {
            var _this$onChange;
            let target = end.clone();
            if (this.offsetVector) {
              target = target.add(this.offsetVector);
            }
            if (this.hasYAxis == false) target.y = 0;

            // 移动方向与移动数度
            let start = this.ns == Node.NodeSpace.WORLD ? this.node.worldPosition : this.node.position;
            this.velocity = Vec3Util.sub(target, start).normalize();

            // 移动时间与目标偏位置计算
            let distance = Vec3.distance(start, target) - this.offset;

            // 目标位置修改事件
            (_this$onChange = this.onChange) == null || _this$onChange.call(this);
            if (distance <= 0) {
              this.exit();
              return;
            } else {
              var _this$onStart;
              (_this$onStart = this.onStart) == null || _this$onStart.call(this);
              this.timer.step = distance / this.speed;
              this.end = end.clone();
            }
          }
          if (this.speed > 0) {
            let trans = Vec3Util.mul(this.velocity, this.speed * dt);
            if (this.ns == Node.NodeSpace.WORLD) this.node.worldPosition = Vec3Util.add(this.node.worldPosition, trans);else this.node.position = Vec3Util.add(this.node.position, trans);
          }

          // 移动完成事件
          if (this.timer.update(dt)) {
            if (this.offset == 0) {
              if (this.ns == Node.NodeSpace.WORLD) this.node.worldPosition = this.end;else this.node.position = this.end;
            }
            this.exit();
          }
        }
        exit() {
          var _this$onComplete;
          (_this$onComplete = this.onComplete) == null || _this$onComplete.call(this);
          this.destroy();
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MoveTo2.ts", ['cc', './Timer.ts', './Vec3Util.ts', './ECS.ts'], function (exports) {
  var cclegacy, Node, Vec3, Timer, Vec3Util, ecs;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Vec3 = module.Vec3;
    }, function (module) {
      Timer = module.Timer;
    }, function (module) {
      Vec3Util = module.Vec3Util;
    }, function (module) {
      ecs = module.ecs;
    }],
    execute: function () {
      var _dec, _class, _dec2, _class3;
      cclegacy._RF.push({}, "eb55etQ2s5OdYllNHXAsRg1", "MoveTo", undefined);

      /** 向目标移动，移动过程中目标位置变化会自动修正移动目标点，直到未修正前移动到目标点停止 */
      let MoveToComp = exports('MoveToComp', (_dec = ecs.register('MoveTo'), _dec(_class = class MoveToComp extends ecs.Comp {
        constructor(...args) {
          super(...args);
          /** 移动节点 */
          this.node = null;
          /** 移动方向 */
          this.velocity = Vec3Util.zero;
          /** 移动速度（每秒移动的像素距离） */
          this.speed = 0;
          /** 目标实体ECS编号、目标位置 */
          this.target = null;
          /** 坐标标（默认本地坐标） */
          this.ns = Node.NodeSpace.LOCAL;
          /** 偏移距离 */
          this.offset = 0;
          /** 偏移向量 */
          this.offsetVector = null;
          /** 移动完成回调 */
          this.onComplete = null;
          /** 距离变化时 */
          this.onChange = null;
        }
        reset() {
          this.ns = Node.NodeSpace.LOCAL;
          this.offset = 0;
          this.target = null;
          this.offsetVector = null;
          this.onComplete = null;
          this.onChange = null;
        }
      }) || _class));
      let VariableMoveToComponent = (_dec2 = ecs.register('VariableMoveTo'), _dec2(_class3 = class VariableMoveToComponent extends ecs.Comp {
        constructor(...args) {
          super(...args);
          /** 延时触发器 */
          this.timer = new Timer();
          /** 终点备份 */
          this.end = null;
          /** 目标位置 */
          this.target = void 0;
        }
        reset() {
          this.end = null;
          this.timer.reset();
        }
      }) || _class3);
      /** 跟踪移动到目标位置 */
      class MoveToSystem extends ecs.ComblockSystem {
        filter() {
          return ecs.allOf(MoveToComp);
        }
        entityEnter(e) {
          e.add(VariableMoveToComponent);
        }
        entityRemove(e) {
          e.remove(VariableMoveToComponent);
        }
        update(e) {
          let move = e.get(MoveToComp);
          let mtv = e.get(VariableMoveToComponent);
          let end;
          console.assert(move.speed > 0, "移动速度必须要大于零");
          if (move.target instanceof Node) {
            end = move.ns == Node.NodeSpace.WORLD ? move.target.worldPosition : move.target.position;
          } else {
            end = move.target;
          }

          // 目标移动后，重计算移动方向与移动到目标点的速度
          if (mtv.end == null || !mtv.end.strictEquals(end)) {
            var _move$onChange;
            let target = end.clone();
            if (move.offsetVector) {
              target = target.add(move.offsetVector); // 这里的问题
            }

            // 移动方向与移动数度
            let start = move.ns == Node.NodeSpace.WORLD ? move.node.worldPosition : move.node.position;
            move.velocity = Vec3Util.sub(target, start).normalize();

            // 移动时间与目标偏位置计算
            let distance = Vec3.distance(start, target) - move.offset;
            (_move$onChange = move.onChange) == null || _move$onChange.call(this);
            if (distance - move.offset <= 0) {
              this.exit(e);
            } else {
              mtv.timer.step = distance / move.speed;
              mtv.end = end.clone();
              mtv.target = move.velocity.clone().multiplyScalar(distance).add(start);
            }
          }
          if (move.speed > 0) {
            let trans = Vec3Util.mul(move.velocity, move.speed * this.dt);
            move.node.translate(trans, Node.NodeSpace.LOCAL);
          }

          // 移动完成事件
          if (mtv.timer.update(this.dt)) {
            if (move.ns == Node.NodeSpace.WORLD) move.node.worldPosition = mtv.target;else move.node.position = mtv.target;
            this.exit(e);
          }
        }
        exit(e) {
          var _move$onComplete;
          let move = e.get(MoveToComp);
          (_move$onComplete = move.onComplete) == null || _move$onComplete.call(this);
          e.remove(VariableMoveToComponent);
          e.remove(MoveToComp);
        }
      }
      exports('MoveToSystem', MoveToSystem);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MoveTranslate.ts", ['cc', './Vec3Util.ts'], function (exports) {
  var cclegacy, Component, Vec3, Node, _decorator, Vec3Util;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Vec3 = module.Vec3;
      Node = module.Node;
      _decorator = module._decorator;
    }, function (module) {
      Vec3Util = module.Vec3Util;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "e626612zClLO4OZDEWvT+fr", "MoveTranslate", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 角色坐标方式移动 */
      let MoveTranslate = exports('MoveTranslate', (_dec = ccclass('MoveTranslate'), _dec(_class = class MoveTranslate extends Component {
        constructor(...args) {
          super(...args);
          /** 移动方向 */
          this.velocity = Vec3Util.zero;
          /** 移动速度 */
          this.speed = 0;
          this.vector = new Vec3();
        }
        update(dt) {
          if (this.speed > 0) {
            Vec3.multiplyScalar(this.vector, this.velocity, this.speed * dt);
            this.node.translate(this.vector, Node.NodeSpace.WORLD);
          }
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NavLine.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      // /*
      cclegacy._RF.push({}, "41dce0XCUNII74J0zSeaDUf", "NavLine", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetChannelManager.ts", ['cc', './Oops.ts', './NetProtocolPako.ts', './WebSock.ts', './NetConfig.ts', './NetGameTips.ts', './NetNodeGame.ts'], function (exports) {
  var cclegacy, oops, NetProtocolPako, WebSock, netConfig, NetGameTips, NetNodeGame;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      NetProtocolPako = module.NetProtocolPako;
    }, function (module) {
      WebSock = module.WebSock;
    }, function (module) {
      netConfig = module.netConfig;
    }, function (module) {
      NetGameTips = module.NetGameTips;
    }, function (module) {
      NetNodeGame = module.NetNodeGame;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ac861qhh0NGap/G024bE62U", "NetChannelManager", undefined);
      let NetChannelType = exports('NetChannelType', /*#__PURE__*/function (NetChannelType) {
        NetChannelType[NetChannelType["Game"] = 0] = "Game";
        return NetChannelType;
      }({}));

      /** 游戏服务器心跳协议 */
      class GameProtocol extends NetProtocolPako {
        /** 心跳协议 */
        getHearbeat() {
          return `{"action":"LoginAction","method":"heart","data":"null","isCompress":false,"channelid":${netConfig.channelid},"callback":"LoginAction_heart"}`;
        }
      }
      class NetChannelManager {
        constructor() {
          this.game = void 0;
        }
        /** 创建游戏服务器 */
        gameCreate() {
          this.game = new NetNodeGame();
          // 游戏网络事件逻辑统一在 NetGameTips 里写
          this.game.init(new WebSock(), new GameProtocol(), new NetGameTips());
          oops.tcp.setNetNode(this.game, NetChannelType.Game);
        }

        /** 连接游戏服务器 */
        gameConnect() {
          oops.tcp.connect({
            url: `ws://${netConfig.gameIp}:${netConfig.gamePort}`,
            autoReconnect: 0 // 手动重连接
          }, NetChannelType.Game);
        }

        /** 断开游戏服务器 */
        gameClose() {
          oops.tcp.close(undefined, undefined, NetChannelType.Game);
        }
      }
      exports('NetChannelManager', NetChannelManager);
      var netChannel = exports('netChannel', new NetChannelManager());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetConfig.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "de66cfdp+NPdoTql8TK/EPP", "NetConfig", undefined);
      /*
       * @Date: 2021-08-12 09:33:37
       * @LastEditors: dgflash
       * @LastEditTime: 2022-01-24 15:15:30
       */

      /** 网络配置 */
      class NetConfig {
        constructor() {
          this.gameIp = "192.168.1.150";
          this.gamePort = "9587";
          this.dbid = void 0;
          this.sdkUid = void 0;
          this.serverId = void 0;
          this.sessionKey = void 0;
          this.channelid = void 0;
        }
      }
      var netConfig = exports('netConfig', new NetConfig());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetGameTips.ts", ['cc', './Logger.ts', './Oops.ts', './GameEvent.ts', './TipsManager.ts'], function (exports) {
  var cclegacy, Logger, oops, GameEvent, tips;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Logger = module.Logger;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      GameEvent = module.GameEvent;
    }, function (module) {
      tips = module.tips;
    }],
    execute: function () {
      cclegacy._RF.push({}, "446e8kFjPpJwq94XGBFl1Tc", "NetGameTips", undefined);

      /** 游戏服务器提示 */
      class NetGameTips {
        /** 连接提示 */
        connectTips(isShow) {
          if (isShow) {
            Logger.logNet("游戏服务器正在连接");
            tips.netInstableOpen();
          } else {
            Logger.logNet("游戏服务器连接成功");
            tips.netInstableClose();
            oops.message.dispatchEvent(GameEvent.GameServerConnected);
          }
        }

        /** 重连接提示 */
        reconnectTips(isShow) {}

        /** 请求提示 */
        requestTips(isShow) {}

        /** 响应错误码提示 */
        responseErrorCode(code) {
          console.log("游戏服务器错误码", code);
          if (code < 0) {
            tips.alert("netcode_" + code, () => {
              // SDKPlatform.restartGame(;)
            });
          } else {
            tips.alert("netcode_" + code);
          }
        }
      }
      exports('NetGameTips', NetGameTips);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetInterface.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d9f8b+CV69FyKwnUdCjOtad", "NetInterface", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-09-01 18:00:28
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-09 18:31:18
       */
      /*
       * 网络相关接口定义
       */
      /** 请求协议 */
      /** 响应协议 */
      /** 回调对象 */
      /** 请求对象 */
      /** 协议辅助接口 */
      /** Socket接口 */
      /** 网络提示接口 */
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetManager.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d8cd5el6GBGTYTW+N8b8EuJ", "NetManager", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-09-01 18:00:28
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-09 18:10:50
       */
      /*
       * 网络节点管理类
       */
      class NetManager {
        constructor() {
          this._channels = {};
        }
        /** 网络管理单例对象 */
        static getInstance() {
          if (!this._instance) {
            this._instance = new NetManager();
          }
          return this._instance;
        }

        /**
         * 添加网络节点
         * @param node       网络节点
         * @param channelId  通道编号
         * @example
        // 游戏服务器心跳协议
        class GameProtocol extends NetProtocolPako { 
            // 自定义心跳协议
            getHearbeat(): NetData { 
                return '{"action":"LoginAction","method":"heart","data":"null","callback":"LoginAction_heart"}';
            }
        }
            
        var net = new NetNodeGame();
        var ws = new WebSock();        // WebSocket 网络连接对象
        var gp = new GameProtocol();   // 网络通讯协议对象
        var gt = new NetGameTips()     // 网络提示对象
        net.init(ws, gp, gt);
        NetManager.getInstance().setNetNode(net, NetChannelType.Game);
         */
        setNetNode(node, channelId = 0) {
          this._channels[channelId] = node;
        }

        /** 移除Node */
        removeNetNode(channelId) {
          delete this._channels[channelId];
        }

        /**
         * 网络节点连接服务器
         * @param options      连接参数
         * @param channelId    通道编号
         * @example
        var options = {
            url: 'ws://127.0.0.1:3000',
            autoReconnect: 0            // -1 永久重连，0不自动重连，其他正整数为自动重试次数
        }
        NetManager.getInstance().connect(options, NetChannelType.Game);
         */
        connect(options, channelId = 0) {
          if (this._channels[channelId]) {
            return this._channels[channelId].connect(options);
          }
          return false;
        }

        /** 节点连接发送数据*/
        send(buf, force = false, channelId = 0) {
          let node = this._channels[channelId];
          if (node) {
            return node.send(buf, force);
          }
          return -1;
        }

        /**
         * 发起请求，并在在结果返回时调用指定好的回调函数
         * @param reqProtocol 请求协议
         * @param rspObject   回调对象
         * @param showTips    是否触发请求提示
         * @param force       是否强制发送
         * @param channelId   通道编号
         * @example
        let protocol: IRequestProtocol = {
            action: action,
            method: method,
            data: JSON.stringify(data),
            isCompress: this.isCompress,
            channelid: netConfig.channelid
        }
        return this.request(protocol, rspObject, showTips, force);
         */
        request(reqProtocol, rspObject, showTips = true, force = false, channelId = 0) {
          let node = this._channels[channelId];
          if (node) {
            node.request(reqProtocol, rspObject, showTips, force);
          }
        }

        /**
         * 同request功能一致，但在request之前会先判断队列中是否已有rspCmd，如有重复的则直接返回
         * @param reqProtocol 请求协议
         * @param rspObject   回调对象
         * @param showTips    是否触发请求提示
         * @param force       是否强制发送
         * @param channelId   通道编号
         * @example
        let protocol: IRequestProtocol = {
            action: action,
            method: method,
            data: JSON.stringify(data),
            isCompress: this.isCompress,
            channelid: netConfig.channelid
        }
        return this.request(protocol, rspObject, showTips, force);
         */
        requestUnique(reqProtocol, rspObject, showTips = true, force = false, channelId = 0) {
          let node = this._channels[channelId];
          if (node) {
            return node.requestUnique(reqProtocol, rspObject, showTips, force);
          }
          return false;
        }

        /**
         * 节点网络断开
         * @param code        关闭码
         * @param reason      关闭原因
         * @param channelId   通道编号
         * @example 
         * NetManager.getInstance().close(undefined, undefined, NetChannelType.Game);
         */
        close(code, reason, channelId = 0) {
          if (this._channels[channelId]) {
            return this._channels[channelId].closeSocket(code, reason);
          }
        }
      }
      exports('NetManager', NetManager);
      NetManager._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetNode.ts", ['cc', './Logger.ts'], function (exports) {
  var cclegacy, error, warn, Logger;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      error = module.error;
      warn = module.warn;
    }, function (module) {
      Logger = module.Logger;
    }],
    execute: function () {
      cclegacy._RF.push({}, "57f0fB90kNBUJ98yyu+jxjx", "NetNode", undefined);

      /*
      *   CocosCreator网络节点基类，以及网络相关接口定义
      *   1. 网络连接、断开、请求发送、数据接收等基础功能
      *   2. 心跳机制
      *   3. 断线重连 + 请求重发
      *   4. 调用网络屏蔽层
      */

      var NetNodeStateStrs = ["已关闭", "连接中", "验证中", "可传输数据"];

      /** 网络提示类型枚举 */
      let NetTipsType = exports('NetTipsType', /*#__PURE__*/function (NetTipsType) {
        NetTipsType[NetTipsType["Connecting"] = 0] = "Connecting";
        NetTipsType[NetTipsType["ReConnecting"] = 1] = "ReConnecting";
        NetTipsType[NetTipsType["Requesting"] = 2] = "Requesting";
        return NetTipsType;
      }({}));

      /** 网络状态枚举 */
      let NetNodeState = exports('NetNodeState', /*#__PURE__*/function (NetNodeState) {
        NetNodeState[NetNodeState["Closed"] = 0] = "Closed";
        NetNodeState[NetNodeState["Connecting"] = 1] = "Connecting";
        NetNodeState[NetNodeState["Checking"] = 2] = "Checking";
        NetNodeState[NetNodeState["Working"] = 3] = "Working";
        return NetNodeState;
      }({})); // 可传输数据

      /** 网络连接参数 */

      /** 网络节点 */
      class NetNode {
        constructor() {
          this._connectOptions = null;
          this._autoReconnect = 0;
          this._isSocketInit = false;
          // Socket是否初始化过
          this._isSocketOpen = false;
          // Socket是否连接成功过
          this._state = NetNodeState.Closed;
          // 节点当前状态
          this._socket = null;
          // Socket对象（可能是原生socket、websocket、wx.socket...)
          this._networkTips = null;
          // 网络提示ui对象（请求提示、断线重连提示等）
          this._protocolHelper = null;
          // 包解析对象
          this._connectedCallback = null;
          // 连接完成回调
          this._disconnectCallback = null;
          // 断线回调
          this._callbackExecuter = null;
          // 回调执行
          this._keepAliveTimer = null;
          // 心跳定时器
          this._receiveMsgTimer = null;
          // 接收数据定时器
          this._reconnectTimer = null;
          // 重连定时器
          this._heartTime = 10000;
          // 心跳间隔
          this._receiveTime = 6000000;
          // 多久没收到数据断开
          this._reconnetTimeOut = 8000000;
          // 重连间隔
          this._requests = Array();
          // 请求列表
          this._listener = {};
        }
        // 监听者列表
        /********************** 网络相关处理 *********************/
        init(socket, protocol, networkTips = null, execFunc = null) {
          Logger.logNet(`网络初始化`);
          this._socket = socket;
          this._protocolHelper = protocol;
          this._networkTips = networkTips;
          this._callbackExecuter = execFunc ? execFunc : (callback, buffer) => {
            callback.callback.call(callback.target, buffer);
          };
        }

        /**
         * 请求连接服务器
         * @param options 连接参数
         */
        connect(options) {
          if (this._socket && this._state == NetNodeState.Closed) {
            if (!this._isSocketInit) {
              this.initSocket();
            }
            this._state = NetNodeState.Connecting;
            if (!this._socket.connect(options)) {
              this.updateNetTips(NetTipsType.Connecting, false);
              return false;
            }
            if (this._connectOptions == null && typeof options.autoReconnect == "number") {
              this._autoReconnect = options.autoReconnect;
            }
            this._connectOptions = options;
            this.updateNetTips(NetTipsType.Connecting, true);
            return true;
          }
          return false;
        }
        initSocket() {
          if (this._socket) {
            this._socket.onConnected = event => {
              this.onConnected(event);
            };
            this._socket.onMessage = msg => {
              this.onMessage(msg);
            };
            this._socket.onError = event => {
              this.onError(event);
            };
            this._socket.onClosed = event => {
              this.onClosed(event);
            };
            this._isSocketInit = true;
          }
        }
        updateNetTips(tipsType, isShow) {
          if (this._networkTips) {
            if (tipsType == NetTipsType.Requesting) {
              this._networkTips.requestTips(isShow);
            } else if (tipsType == NetTipsType.Connecting) {
              this._networkTips.connectTips(isShow);
            } else if (tipsType == NetTipsType.ReConnecting) {
              this._networkTips.reconnectTips(isShow);
            }
          }
        }

        /** 网络连接成功 */
        onConnected(event) {
          Logger.logNet("网络已连接");
          this._isSocketOpen = true;
          // 如果设置了鉴权回调，在连接完成后进入鉴权阶段，等待鉴权结束
          if (this._connectedCallback !== null) {
            this._state = NetNodeState.Checking;
            this._connectedCallback(() => {
              this.onChecked();
            });
          } else {
            this.onChecked();
          }
          Logger.logNet(`网络已连接当前状态为【${NetNodeStateStrs[this._state]}】`);
        }

        /** 连接验证成功，进入工作状态 */
        onChecked() {
          Logger.logNet("连接验证成功，进入工作状态");
          this._state = NetNodeState.Working;
          // 关闭连接或重连中的状态显示
          this.updateNetTips(NetTipsType.Connecting, false);
          this.updateNetTips(NetTipsType.ReConnecting, false);

          // 重发待发送信息
          var requests = this._requests.concat();
          if (requests.length > 0) {
            Logger.logNet(`请求【${this._requests.length}】个待发送的信息`);
            for (var i = 0; i < requests.length;) {
              let req = requests[i];
              this._socket.send(req.buffer);
              if (req.rspObject == null || req.rspCmd != "") {
                requests.splice(i, 1);
              } else {
                ++i;
              }
            }
            // 如果还有等待返回的请求，启动网络请求层
            this.updateNetTips(NetTipsType.Requesting, this._requests.length > 0);
          }
        }

        /** 接收到一个完整的消息包 */
        onMessage(msg) {
          // Logger.logNet(`接受消息状态为【${NetNodeStateStrs[this._state]}】`);

          var json = JSON.parse(msg);

          // 进行头部的校验（实际包长与头部长度是否匹配）
          if (!this._protocolHelper.checkResponsePackage(json)) {
            error(`校验接受消息数据异常`);
            return;
          }

          // 处理相应包数据
          if (!this._protocolHelper.handlerResponsePackage(json)) {
            if (this._networkTips) this._networkTips.responseErrorCode(json.code);
          }

          // 接受到数据，重新定时收数据计时器
          this.resetReceiveMsgTimer();
          // 重置心跳包发送器
          this.resetHearbeatTimer();
          // 触发消息执行
          let rspCmd = this._protocolHelper.getPackageId(json);
          Logger.logNet(`接受到命令【${rspCmd}】的消息`);
          // 优先触发request队列
          if (this._requests.length > 0) {
            for (let reqIdx in this._requests) {
              let req = this._requests[reqIdx];
              if (req.rspCmd == rspCmd && req.rspObject) {
                Logger.logNet(`触发请求命令【${rspCmd}】的回调`);
                this._callbackExecuter(req.rspObject, json.data);
                this._requests.splice(parseInt(reqIdx), 1);
                break;
              }
            }
            if (this._requests.length == 0) {
              this.updateNetTips(NetTipsType.Requesting, false);
            } else {
              Logger.logNet(`请求队列中还有【${this._requests.length}】个请求在等待`);
            }
          }
          let listeners = this._listener[rspCmd];
          if (null != listeners) {
            for (const rsp of listeners) {
              Logger.logNet(`触发监听命令【${rspCmd}】的回调`);
              this._callbackExecuter(rsp, json.data);
            }
          }
        }
        onError(event) {
          error(event);
        }
        onClosed(event) {
          this.clearTimer();

          // 执行断线回调，返回false表示不进行重连
          if (this._disconnectCallback && !this._disconnectCallback()) {
            Logger.logNet(`断开连接`);
            return;
          }

          // 自动重连
          if (this.isAutoReconnect()) {
            this.updateNetTips(NetTipsType.ReConnecting, true);
            this._reconnectTimer = setTimeout(() => {
              this._socket.close();
              this._state = NetNodeState.Closed;
              this.connect(this._connectOptions);
              if (this._autoReconnect > 0) {
                this._autoReconnect -= 1;
              }
            }, this._reconnetTimeOut);
          } else {
            this._state = NetNodeState.Closed;
          }
        }

        /**
         * 断开网络
         * @param code      关闭码
         * @param reason    关闭原因
         */
        close(code, reason) {
          this.clearTimer();
          this._listener = {};
          this._requests.length = 0;
          if (this._networkTips) {
            this._networkTips.connectTips(false);
            this._networkTips.reconnectTips(false);
            this._networkTips.requestTips(false);
          }
          if (this._socket) {
            this._socket.close(code, reason);
          } else {
            this._state = NetNodeState.Closed;
          }
        }

        /**
         * 只是关闭Socket套接字（仍然重用缓存与当前状态）
         * @param code      关闭码
         * @param reason    关闭原因
         */
        closeSocket(code, reason) {
          if (this._socket) {
            this._socket.close(code, reason);
          }
        }

        /**
         * 发起请求，如果当前处于重连中，进入缓存列表等待重连完成后发送
         * @param buf       网络数据
         * @param force     是否强制发送
         */
        send(buf, force = false) {
          if (this._state == NetNodeState.Working || force) {
            return this._socket.send(buf);
          } else if (this._state == NetNodeState.Checking || this._state == NetNodeState.Connecting) {
            this._requests.push({
              buffer: buf,
              rspCmd: "",
              rspObject: null
            });
            Logger.logNet(`当前状态为【${NetNodeStateStrs[this._state]}】,繁忙并缓冲发送数据`);
            return 0;
          } else {
            error(`当前状态为【${NetNodeStateStrs[this._state]}】,请求错误`);
            return -1;
          }
        }

        /**
         * 发起请求，并进入缓存列表
         * @param reqProtocol 请求协议
         * @param rspObject   回调对象
         * @param showTips    是否触发请求提示
         * @param force       是否强制发送
         */
        request(reqProtocol, rspObject, showTips = true, force = false) {
          var rspCmd = this._protocolHelper.handlerRequestPackage(reqProtocol);
          this.base_request(reqProtocol, rspCmd, rspObject, showTips, force);
        }

        /**
         * 唯一request，确保没有同一响应的请求（避免一个请求重复发送，netTips界面的屏蔽也是一个好的方法）
         * @param reqProtocol 请求协议
         * @param rspObject   回调对象
         * @param showTips    是否触发请求提示
         * @param force       是否强制发送
         */
        requestUnique(reqProtocol, rspObject, showTips = true, force = false) {
          var rspCmd = this._protocolHelper.handlerRequestPackage(reqProtocol);
          for (let i = 0; i < this._requests.length; ++i) {
            if (this._requests[i].rspCmd == rspCmd) {
              Logger.logNet(`命令【${rspCmd}】重复请求`);
              return false;
            }
          }
          this.base_request(reqProtocol, rspCmd, rspObject, showTips, force);
          return true;
        }
        base_request(reqProtocol, rspCmd, rspObject, showTips = true, force = false) {
          var buf = JSON.stringify(reqProtocol); // 转为二进制流发送

          if (this._state == NetNodeState.Working || force) {
            this._socket.send(buf);
          }
          Logger.logNet(`队列命令为【${rspCmd}】的请求，等待请求数据的回调`);

          // 进入发送缓存列表
          this._requests.push({
            buffer: buf,
            rspCmd,
            rspObject
          });
          // 启动网络请求层
          if (showTips) {
            this.updateNetTips(NetTipsType.Requesting, true);
          }
        }

        /********************** 回调相关处理 *********************/
        /**
         * 设置一个唯一的服务器推送监听
         * @param cmd       命令字串
         * @param callback  回调方法
         * @param target    目标对象
         */
        setResponeHandler(cmd, callback, target) {
          if (callback == null) {
            error(`命令为【${cmd}】设置响应处理程序错误`);
            return false;
          }
          this._listener[cmd] = [{
            target,
            callback
          }];
          return true;
        }

        /**
         * 可添加多个同类返回消息的监听
         * @param cmd       命令字串
         * @param callback  回调方法
         * @param target    目标对象
         * @returns 
         */
        addResponeHandler(cmd, callback, target) {
          if (callback == null) {
            error(`命令为【${cmd}】添加响应处理程序错误`);
            return false;
          }
          let rspObject = {
            target,
            callback
          };
          if (null == this._listener[cmd]) {
            this._listener[cmd] = [rspObject];
          } else {
            let index = this.getNetListenersIndex(cmd, rspObject);
            if (-1 == index) {
              this._listener[cmd].push(rspObject);
            }
          }
          return true;
        }

        /**
         * 删除一个监听中指定子回调
         * @param cmd       命令字串
         * @param callback  回调方法
         * @param target    目标对象
         */
        removeResponeHandler(cmd, callback, target) {
          if (null != this._listener[cmd] && callback != null) {
            let index = this.getNetListenersIndex(cmd, {
              target,
              callback
            });
            if (-1 != index) {
              this._listener[cmd].splice(index, 1);
            }
          }
        }

        /**
         * 清除所有监听或指定命令的监听
         * @param cmd  命令字串（默认不填为清除所有）
         */
        cleanListeners(cmd = "") {
          if (cmd == "") {
            this._listener = {};
          } else {
            delete this._listener[cmd];
          }
        }
        getNetListenersIndex(cmd, rspObject) {
          let index = -1;
          for (let i = 0; i < this._listener[cmd].length; i++) {
            let iterator = this._listener[cmd][i];
            if (iterator.callback == rspObject.callback && iterator.target == rspObject.target) {
              index = i;
              break;
            }
          }
          return index;
        }

        /********************** 心跳、超时相关处理 *********************/
        resetReceiveMsgTimer() {
          if (this._receiveMsgTimer !== null) {
            clearTimeout(this._receiveMsgTimer);
          }
          this._receiveMsgTimer = setTimeout(() => {
            warn("接收消息定时器关闭网络连接");
            this._socket.close();
          }, this._receiveTime);
        }
        resetHearbeatTimer() {
          if (this._keepAliveTimer !== null) {
            clearTimeout(this._keepAliveTimer);
          }
          this._keepAliveTimer = setTimeout(() => {
            Logger.logNet("网络节点保持活跃发送心跳信息");
            this.send(this._protocolHelper.getHearbeat());
          }, this._heartTime);
        }
        clearTimer() {
          if (this._receiveMsgTimer !== null) {
            clearTimeout(this._receiveMsgTimer);
          }
          if (this._keepAliveTimer !== null) {
            clearTimeout(this._keepAliveTimer);
          }
          if (this._reconnectTimer !== null) {
            clearTimeout(this._reconnectTimer);
          }
        }

        /** 是否自动重连接 */
        isAutoReconnect() {
          return this._autoReconnect != 0;
        }

        /** 拒绝重新连接 */
        rejectReconnect() {
          this._autoReconnect = 0;
          this.clearTimer();
        }
      }
      exports('NetNode', NetNode);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetNodeGame.ts", ['cc', './NetNode.ts', './NetConfig.ts'], function (exports) {
  var cclegacy, NetNode, netConfig;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      NetNode = module.NetNode;
    }, function (module) {
      netConfig = module.netConfig;
    }],
    execute: function () {
      cclegacy._RF.push({}, "bcdefoeZ55NF5b09cJUF6Xi", "NetNodeGame", undefined);

      /** 网络节点扩展 */
      class NetNodeGame extends NetNode {
        constructor(...args) {
          super(...args);
          this.isCompress = false;
        }
        req(action, method, data, rspObject, showTips = true, force = false) {
          let protocol = {
            cmd: action,
            data: JSON.stringify(data),
            isCompress: this.isCompress,
            channelid: netConfig.channelid
          };
          return this.request(protocol, rspObject, showTips, force);
        }
        reqUnique(action, method, data, rspObject, showTips = true, force = false) {
          let protocol = {
            cmd: action,
            data: JSON.stringify(data),
            isCompress: this.isCompress,
            channelid: netConfig.channelid
          };
          return super.requestUnique(protocol, rspObject, showTips, force);
        }
      }
      exports('NetNodeGame', NetNodeGame);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetProtocolPako.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "88ae0lIg5BFWb1O1E8/Etwi", "NetProtocolPako", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-04-21 13:45:51
       * @LastEditors: dgflash
       * @LastEditTime: 2022-04-21 13:51:33
       */
      var unzip = function (str) {
        let charData = str.split('').map(function (x) {
          return x.charCodeAt(0);
        });
        let binData = new Uint8Array(charData);
        //@ts-ignore
        let data = pako.inflate(binData, {
          to: 'string'
        });
        return data;
      };
      var zip = function (str) {
        //@ts-ignore
        let binaryString = pako.gzip(str, {
          to: 'string'
        });
        return binaryString;
      };

      /** Pako.js 数据压缩协议 */
      class NetProtocolPako {
        getHeadlen() {
          return 0;
        }
        getHearbeat() {
          return "";
        }
        getPackageLen(msg) {
          return msg.toString().length;
        }
        checkResponsePackage(respProtocol) {
          return true;
        }
        handlerResponsePackage(respProtocol) {
          if (respProtocol.code == 1) {
            if (respProtocol.isCompress) {
              respProtocol.data = unzip(respProtocol.data);
            }
            respProtocol.data = JSON.parse(respProtocol.data);
            return true;
          } else {
            return false;
          }
        }
        handlerRequestPackage(reqProtocol) {
          var rspCmd = reqProtocol.cmd;
          reqProtocol.callback = rspCmd;
          if (reqProtocol.isCompress) {
            reqProtocol.data = zip(reqProtocol.data);
          }
          return rspCmd;
        }
        getPackageId(respProtocol) {
          return respProtocol.callback;
        }
      }
      exports('NetProtocolPako', NetProtocolPako);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetProtocolProtobuf.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "5714auyGttOSrOXeVsvIAUz", "NetProtocolProtobuf", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-04-21 13:48:44
       * @LastEditors: dgflash
       * @LastEditTime: 2022-04-21 14:11:25
       */
      /** Protobuf.js 数据压缩协议 */
      class NetProtocolProtobuf {
        getHeadlen() {
          return 0;
        }
        getHearbeat() {
          return "";
        }
        getPackageLen(msg) {
          return msg.toString().length;
        }
        checkResponsePackage(respProtocol) {
          return true;
        }
        handlerResponsePackage(respProtocol) {
          if (respProtocol.code == 1) {
            if (respProtocol.isCompress) ;
            respProtocol.data = JSON.parse(respProtocol.data);
            return true;
          } else {
            return false;
          }
        }
        handlerRequestPackage(reqProtocol) {
          var rspCmd = reqProtocol.cmd;
          reqProtocol.callback = rspCmd;
          if (reqProtocol.isCompress) ;
          return rspCmd;
        }
        getPackageId(respProtocol) {
          return respProtocol.callback;
        }
      }
      exports('NetProtocolProtobuf', NetProtocolProtobuf);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NodeDragExt.ts", ['cc'], function () {
  var cclegacy, Node, js, Vec2, v3;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      js = module.js;
      Vec2 = module.Vec2;
      v3 = module.v3;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1a072/udu9MtbdbyL5xB8iR", "NodeDragExt", undefined);

      /** 节点拖拽功能 */
      {
        //@ts-ignore
        if (!Node.prototype["__$cc-node-drag-extension$__"]) {
          //@ts-ignore
          Node.prototype["__$cc-node-drag-extension$__"] = true;
          let _DragEvent = {
            DRAG_START: "drag_start",
            DRAG_MOVE: "drag_move",
            DRAG_END: "drag_end"
          };
          js.mixin(Node, {
            DragEvent: _DragEvent
          });

          //----------------   Node 添加 拖拽属性 ----------------

          js.mixin(Node.prototype, {
            _draggable: false,
            _dragging: false,
            _dragTesting: false,
            _dragStartPoint: null,
            initDrag: function () {
              if (this._draggable) {
                this.on(Node.EventType.TOUCH_START, this.onTouchBegin_0, this);
                this.on(Node.EventType.TOUCH_MOVE, this.onTouchMove_0, this);
                this.on(Node.EventType.TOUCH_END, this.onTouchEnd_0, this);
                this.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel_0, this);
              } else {
                this.off(Node.EventType.TOUCH_START, this.onTouchBegin_0, this);
                this.off(Node.EventType.TOUCH_MOVE, this.onTouchMove_0, this);
                this.off(Node.EventType.TOUCH_END, this.onTouchEnd_0, this);
                this.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel_0, this);
              }
            },
            onTouchBegin_0: function (event) {
              if (this._dragStartPoint == null) {
                this._dragStartPoint = new Vec2();
              }

              // event.preventSwallow = true;
              let pos = event.getUILocation();
              this._dragStartPoint.set(pos);
              this._dragTesting = true;
            },
            onTouchMove_0: function (event) {
              if (!this._dragging && this._draggable && this._dragTesting) {
                let sensitivity = 10;
                let pos = event.getUILocation();
                if (Math.abs(this._dragStartPoint.x - pos.x) < sensitivity && Math.abs(this._dragStartPoint.y - pos.y) < sensitivity) {
                  return;
                }

                // event.preventSwallow = true;
                this._dragging = true;
                this._dragTesting = false;
                this.emit(Node.DragEvent.DRAG_START, event);
              }
              if (this._dragging) {
                let delta = event.getUIDelta();
                // /** 这里除以 世界缩放，在有缩放的时候拖拽不至于很怪 */
                // this.position = this.position.add(v3(delta.x / this.worldScale.x, delta.y / this.worldScale.y, 0));
                this.position = this.position.add(v3(delta.x, delta.y, 0));
                this.emit(Node.DragEvent.DRAG_MOVE, event);
              }
            },
            onTouchEnd_0: function (event) {
              if (this._dragging) {
                this._dragging = false;
                this.emit(Node.DragEvent.DRAG_END, event);
              }
            },
            onTouchCancel_0: function (event) {
              if (this._dragging) {
                this._dragging = false;
                this.emit(Node.DragEvent.DRAG_END, event);
              }
            },
            startDrag: function () {
              //此节点是否在场景中激活
              if (!this.activeInHierarchy) {
                return;
              }
              this.dragBegin();
            },
            dragBegin: function () {
              this._dragging = true;
              this._dragTesting = true;
              this.on(Node.EventType.TOUCH_MOVE, this.onTouchMove_0, this);
              this.on(Node.EventType.TOUCH_END, this.onTouchEnd_0, this);
              this.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel_0, this);
            },
            dragEnd: function () {
              if (this._dragging) {
                this._dragTesting = false;
                this._dragging = false;
              }
            },
            // 停止拖拽
            stopDrag: function () {
              this.dragEnd();
            },
            // 移除 touch 事件
            removeDragEvent: function () {
              this.off(Node.EventType.TOUCH_START, this.onTouchBegin_0, this);
              this.off(Node.EventType.TOUCH_MOVE, this.onTouchMove_0, this);
              this.off(Node.EventType.TOUCH_END, this.onTouchEnd_0, this);
              this.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel_0, this);
            }
          });

          // 如果 node 设置 node.draggable = true, 则启用 拖拽
          Object.defineProperty(Node.prototype, "draggable", {
            get: function () {
              return this._draggable;
            },
            set: function (value) {
              if (this._draggable != value) {
                this._draggable = value;
                this.initDrag();
              }
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Node.prototype, "dragTesting", {
            get: function () {
              return this._dragTesting;
            },
            set: function (value) {
              if (this._dragTesting != value) {
                this._dragTesting = value;
              }
            },
            enumerable: true,
            configurable: true
          });
          //----------------   Node 添加 拖拽属性 ---------------- end
        }
      }

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NodeExt.ts", ['cc'], function () {
  var cclegacy, Node, UITransform, Size, UIOpacity, UIRenderer, Color, v3, Graphics, Label, RichText, Sprite, Button, Canvas, EditBox, Layout, PageView, ProgressBar, ScrollView, Slider, Toggle, Widget, Mask;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      UITransform = module.UITransform;
      Size = module.Size;
      UIOpacity = module.UIOpacity;
      UIRenderer = module.UIRenderer;
      Color = module.Color;
      v3 = module.v3;
      Graphics = module.Graphics;
      Label = module.Label;
      RichText = module.RichText;
      Sprite = module.Sprite;
      Button = module.Button;
      Canvas = module.Canvas;
      EditBox = module.EditBox;
      Layout = module.Layout;
      PageView = module.PageView;
      ProgressBar = module.ProgressBar;
      ScrollView = module.ScrollView;
      Slider = module.Slider;
      Toggle = module.Toggle;
      Widget = module.Widget;
      Mask = module.Mask;
    }],
    execute: function () {
      cclegacy._RF.push({}, "493a6vtAsNCi7/drbKHIAaL", "NodeExt", undefined);

      // ========= 扩展 cc 提示声明 =========

      /** 扩展节点属性 */
      {
        //@ts-ignore
        if (!Node.prototype["$__definedProperties__"]) {
          //@ts-ignore
          Node.prototype["$__definedProperties__"] = true;
          let componentMap = {
            "uiGraphics": Graphics,
            "uiLabel": Label,
            "uiRichText": RichText,
            "uiSprite": Sprite,
            "uiButton": Button,
            "uiCanvas": Canvas,
            "uiEditBox": EditBox,
            "uiLayout": Layout,
            "uiPageView": PageView,
            "uiProgressBar": ProgressBar,
            "uiScrollView": ScrollView,
            "uiSlider": Slider,
            "uiToggle": Toggle,
            "uiWidget": Widget,
            "uiOpacity": UIOpacity,
            "uITransform": UITransform,
            "uiMask": Mask
          };
          for (const key in componentMap) {
            Object.defineProperty(Node.prototype, key, {
              get: function () {
                return this.getComponent(componentMap[key]);
              },
              set: function (value) {}
            });
          }

          /** 获取、设置节点的 X 欧拉角 */
          Object.defineProperty(Node.prototype, "angle_x", {
            get: function () {
              let self = this;
              return self.eulerAngles.x;
            },
            set: function (value) {
              let self = this;
              self.setRotationFromEuler(value, self.eulerAngles.y, self.eulerAngles.z);
            }
          });

          /** 获取、设置节点的 Y 欧拉角 */
          Object.defineProperty(Node.prototype, "angle_y", {
            get: function () {
              return this.eulerAngles.y;
            },
            set: function (value) {
              let self = this;
              self.setRotationFromEuler(self.eulerAngles.x, value, self.eulerAngles.z);
            }
          });

          /** 获取、设置节点的 Z 欧拉角 */
          Object.defineProperty(Node.prototype, "angle_z", {
            get: function () {
              return this.eulerAngles.y;
            },
            set: function (value) {
              let self = this;
              self.setRotationFromEuler(self.eulerAngles.x, self.eulerAngles.y, value);
            }
          });

          /** 获取、设置节点的 X 坐标 */
          Object.defineProperty(Node.prototype, "x", {
            get: function () {
              let self = this;
              return self.position.x;
            },
            set: function (value) {
              let self = this;
              self.setPosition(value, self.position.y);
            }
          });

          /** 获取、设置节点的 Y 坐标 */
          Object.defineProperty(Node.prototype, "y", {
            get: function () {
              let self = this;
              return self.position.y;
            },
            set: function (value) {
              let self = this;
              self.setPosition(self.position.x, value);
            }
          });

          /** 获取、设置节点的 Z 坐标 */
          Object.defineProperty(Node.prototype, "z", {
            get: function () {
              let self = this;
              return self.position.z;
            },
            set: function (value) {
              let self = this;
              self.setPosition(self.position.x, self.position.y, value);
            }
          });

          /** 获取、设置节点的宽度 */
          Object.defineProperty(Node.prototype, "w", {
            configurable: true,
            get: function () {
              var _self$getComponent;
              let self = this;
              return ((_self$getComponent = self.getComponent(UITransform)) == null ? void 0 : _self$getComponent.width) ?? 0;
            },
            set: function (value) {
              let self = this;
              (self.getComponent(UITransform) || self.addComponent(UITransform)).width = value;
            }
          });

          /** 获取、设置节点的高度 */
          Object.defineProperty(Node.prototype, "h", {
            configurable: true,
            get: function () {
              var _self$getComponent2;
              let self = this;
              return ((_self$getComponent2 = self.getComponent(UITransform)) == null ? void 0 : _self$getComponent2.height) ?? 0;
            },
            set: function (value) {
              let self = this;
              (self.getComponent(UITransform) || self.addComponent(UITransform)).height = value;
            }
          });

          /** 获取、设置节点的尺寸 */
          Object.defineProperty(Node.prototype, "size", {
            get: function () {
              let self = this;
              let uiTransform = self.getComponent(UITransform);
              return new Size(uiTransform.width, uiTransform.height);
            },
            set: function (value) {
              let self = this;
              let uiTransform = self.getComponent(UITransform) || self.addComponent(UITransform);
              uiTransform.width = value.width;
              uiTransform.height = value.height;
            }
          });

          /** 获取、设置节点的水平锚点 */
          Object.defineProperty(Node.prototype, "anchor_x", {
            get: function () {
              var _self$getComponent3;
              let self = this;
              return ((_self$getComponent3 = self.getComponent(UITransform)) == null ? void 0 : _self$getComponent3.anchorX) ?? 0.5;
            },
            set: function (value) {
              let self = this;
              (self.getComponent(UITransform) || self.addComponent(UITransform)).anchorX = value;
            }
          });

          /** 获取、设置节点的垂直锚点 */
          Object.defineProperty(Node.prototype, "anchor_y", {
            get: function () {
              var _self$getComponent4;
              let self = this;
              return ((_self$getComponent4 = self.getComponent(UITransform)) == null ? void 0 : _self$getComponent4.anchorY) ?? 0.5;
            },
            set: function (value) {
              let self = this;
              (self.getComponent(UITransform) || self.addComponent(UITransform)).anchorY = value;
            }
          });

          /** 获取、设置节点的透明度 */
          Object.defineProperty(Node.prototype, "opacity", {
            get: function () {
              let self = this;
              let op = self.getComponent(UIOpacity);
              if (op != null) {
                return op.opacity;
              }
              let render = self.getComponent(UIRenderer);
              if (render) {
                return render.color.a;
              }
              return 255;
            },
            set: function (value) {
              let self = this;
              let op = self.getComponent(UIOpacity);
              if (op != null) {
                op.opacity = value;
                return;
              }
              let render = self.getComponent(UIRenderer);
              if (render) {
                // 直接通过 color.a 设置透明度会有bug，没能直接生效，需要激活节点才生效
                // (render.color.a as any) = value;

                // 创建一个颜色缓存对象，避免每次都创建新对象
                if (!this.$__color__) {
                  this.$__color__ = new Color(render.color.r, render.color.g, render.color.b, value);
                } else {
                  this.$__color__.a = value;
                }
                render.color = this.$__color__; // 设置 color 对象则可以立刻生效
              } else {
                self.addComponent(UIOpacity).opacity = value;
              }
            }
          });

          /** 获取、设置节点的颜色 */
          Object.defineProperty(Node.prototype, "color", {
            get: function () {
              var _self$getComponent5;
              let self = this;
              return (_self$getComponent5 = self.getComponent(UIRenderer)) == null ? void 0 : _self$getComponent5.color;
            },
            set: function (value) {
              let self = this;
              let render = self.getComponent(UIRenderer);
              render && (render.color = value);
            }
          });

          /** 获取、设置节点的 X 缩放系数 */
          Object.defineProperty(Node.prototype, "scale_x", {
            get: function () {
              let self = this;
              return self.scale.x;
            },
            set: function (value) {
              let self = this;
              self.scale = v3(value, self.scale.y, self.scale.z);
            }
          });

          /** 获取、设置节点的 Y 缩放系数 */
          Object.defineProperty(Node.prototype, "scale_y", {
            get: function () {
              let self = this;
              return self.scale.y;
            },
            set: function (value) {
              let self = this;
              self.scale = v3(self.scale.x, value, self.scale.z);
            }
          });

          /** 获取、设置节点的 Z 缩放系数 */
          Object.defineProperty(Node.prototype, "scale_z", {
            get: function () {
              let self = this;
              return self.scale.z;
            },
            set: function (value) {
              let self = this;
              self.scale = v3(self.scale.x, self.scale.y, value);
            }
          });
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Notify.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './LanguageLabel.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Animation, _decorator, Component, LanguageLabel;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Animation = module.Animation;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      LanguageLabel = module.LanguageLabel;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "01391Mp6X1Gn554rkzavN4K", "Notify", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 滚动消息提示组件  */
      let Notify = exports('Notify', (_dec = ccclass('Notify'), _dec2 = property(Label), _dec3 = property(Animation), _dec(_class = (_class2 = class Notify extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "lab_content", _descriptor, this);
          _initializerDefineProperty(this, "animation", _descriptor2, this);
        }
        onLoad() {
          if (this.animation) this.animation.on(Animation.EventType.FINISHED, this.onFinished, this);
        }
        onFinished() {
          this.node.destroy();
        }

        /**
         * 显示提示
         * @param msg       文本
         * @param useI18n   设置为 true 时，使用多语言功能 msg 参数为多语言 key
         */
        toast(msg, useI18n) {
          let label = this.lab_content.getComponent(LanguageLabel);
          if (useI18n) {
            label.enabled = true;
            label.dataID = msg;
          } else {
            label.enabled = false;
            this.lab_content.string = msg;
          }
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lab_content", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "animation", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ObjectUtil.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "86827QLFSRM7Zojsx0WqWuQ", "ObjectUtil", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-07-26 15:29:57
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-02 12:07:54
       */

      /** 对象工具 */
      class ObjectUtil {
        /**
         * 判断指定的值是否为对象
         * @param value 值
         */
        static isObject(value) {
          return Object.prototype.toString.call(value) === '[object Object]';
        }

        /**
         * 深拷贝
         * @param target 目标
         */
        static deepCopy(target) {
          if (target == null || typeof target !== 'object') {
            return target;
          }
          let result = null;
          if (target instanceof Date) {
            result = new Date();
            result.setTime(target.getTime());
            return result;
          }
          if (target instanceof Array) {
            result = [];
            for (let i = 0, length = target.length; i < length; i++) {
              result[i] = this.deepCopy(target[i]);
            }
            return result;
          }
          if (target instanceof Object) {
            result = {};
            for (const key in target) {
              if (target.hasOwnProperty(key)) {
                result[key] = this.deepCopy(target[key]);
              }
            }
            return result;
          }
          console.warn(`不支持的类型：${result}`);
        }

        /**
         * 拷贝对象
         * @param target 目标
         */
        static copy(target) {
          return JSON.parse(JSON.stringify(target));
        }
      }
      exports('ObjectUtil', ObjectUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Oops.ts", ['cc', './ECS.ts', './ViewModel.ts', './HttpRequest.ts', './NetManager.ts', './Config.ts', './MessageManager.ts', './ResLoader.ts', './Logger.ts', './RandomManager.ts', './StorageManager.ts'], function (exports) {
  var cclegacy, ecs, VM, HttpRequest, NetManager, Config, MessageManager, ResLoader, Logger, RandomManager, StorageManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      VM = module.VM;
    }, function (module) {
      HttpRequest = module.HttpRequest;
    }, function (module) {
      NetManager = module.NetManager;
    }, function (module) {
      Config = module.Config;
    }, function (module) {
      MessageManager = module.MessageManager;
    }, function (module) {
      ResLoader = module.ResLoader;
    }, function (module) {
      Logger = module.Logger;
    }, function (module) {
      RandomManager = module.RandomManager;
    }, function (module) {
      StorageManager = module.StorageManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "cbae5wzfSZGzZMuyeAetSfg", "Oops", undefined);
      /** 框架版本号 */
      var version = exports('version', "1.2.0");

      /** 框架核心模块访问入口 */
      class oops {}
      exports('oops', oops);

      // 引入oops全局变量以方便调试
      /** ----------核心模块---------- */
      /** 日志管理 */
      oops.log = Logger;
      /** 游戏配置 */
      oops.config = new Config();
      /** 全局消息 */
      oops.message = MessageManager.Instance;
      /** 随机工具 */
      oops.random = RandomManager.instance;
      /** 本地存储 */
      oops.storage = new StorageManager();
      /** 游戏时间管理 */
      oops.timer = void 0;
      /** 游戏音乐管理 */
      oops.audio = void 0;
      /** 二维界面管理 */
      oops.gui = void 0;
      /** 三维游戏世界管理 */
      oops.game = void 0;
      /** 资源管理 */
      oops.res = new ResLoader();
      /** ----------可选模块---------- */
      /** 多语言模块 */
      oops.language = void 0;
      /** HTTP */
      oops.http = new HttpRequest();
      /** WebSocket */
      oops.tcp = new NetManager();
      /** ECS */
      oops.ecs = new ecs.RootSystem();
      /** MVVM */
      oops.mvvm = VM;
      {
        //@ts-ignore
        window.oops = oops;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/OrbitCamera.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Vec3, Quat, Node, _decorator, Component, input, Input, lerp, Vec2;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      Quat = module.Quat;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      input = module.input;
      Input = module.Input;
      lerp = module.lerp;
      Vec2 = module.Vec2;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14;
      cclegacy._RF.push({}, "4e454G/OQ1NB7tjzAUf269U", "OrbitCamera", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let tempVec3 = new Vec3();
      let tempVec3_2 = new Vec3();
      let tempQuat = new Quat();
      const DeltaFactor = 1 / 200;

      /** 
       * 轨道摄影机
       * 1、触摸自由旋转
       * 2、镜头远近鼠标滚轮调节
       * 3、固定为第三人称摄像机
       */
      let OrbitCamera = exports('OrbitCamera', (_dec = ccclass('OrbitCamera'), _dec2 = property({
        tooltip: "是否启动触摸控制"
      }), _dec3 = property({
        tooltip: "是否开启启用缩放半径（鼠标滚轮控制摄像机与目标距离）"
      }), _dec4 = property({
        tooltip: "摄像机与目标的半径缩放速度",
        visible: function () {
          //@ts-ignore
          return this.enableScaleRadius === true;
        }
      }), _dec5 = property({
        tooltip: "摄像机与目标的半径最小值",
        visible: function () {
          //@ts-ignore
          return this.enableScaleRadius === true;
        }
      }), _dec6 = property({
        tooltip: "摄像机与目标的半径最大值",
        visible: function () {
          //@ts-ignore
          return this.enableScaleRadius === true;
        }
      }), _dec7 = property({
        tooltip: "自动旋转是否开启"
      }), _dec8 = property({
        tooltip: "自动旋转速度",
        visible: function () {
          //@ts-ignore
          return this.autoRotate === true;
        }
      }), _dec9 = property({
        tooltip: "旋转速度"
      }), _dec10 = property({
        tooltip: "跟随速度"
      }), _dec11 = property({
        tooltip: "X轴旋转范围（人物上下看的角度控制）"
      }), _dec12 = property({
        tooltip: "摄像机与目标的距离（以玩家为中心环绕球半径）"
      }), _dec13 = property({
        type: Node,
        tooltip: "跟随目标"
      }), _dec14 = property({
        type: Vec3,
        tooltip: "目标旋转偏移量（初始旋转向量）"
      }), _dec15 = property({
        tooltip: "是否跟随目标 Y 轴旋转"
      }), _dec(_class = (_class2 = class OrbitCamera extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "enableTouch", _descriptor, this);
          _initializerDefineProperty(this, "enableScaleRadius", _descriptor2, this);
          _initializerDefineProperty(this, "radiusScaleSpeed", _descriptor3, this);
          _initializerDefineProperty(this, "minRadius", _descriptor4, this);
          _initializerDefineProperty(this, "maxRadius", _descriptor5, this);
          _initializerDefineProperty(this, "autoRotate", _descriptor6, this);
          _initializerDefineProperty(this, "autoRotateSpeed", _descriptor7, this);
          _initializerDefineProperty(this, "rotateSpeed", _descriptor8, this);
          _initializerDefineProperty(this, "followSpeed", _descriptor9, this);
          _initializerDefineProperty(this, "xRotationRange", _descriptor10, this);
          _initializerDefineProperty(this, "_targetRadius", _descriptor11, this);
          _initializerDefineProperty(this, "_target", _descriptor12, this);
          _initializerDefineProperty(this, "_startRotation", _descriptor13, this);
          _initializerDefineProperty(this, "followTargetRotationY", _descriptor14, this);
          this._center = new Vec3();
          // 摄像机视口方向量
          this._targetCenter = new Vec3();
          // 摄像机中心点位置（目标位置）
          this._touched = false;
          // 是否触摸屏幕
          this._targetRotation = new Vec3();
          // 目标旋转向量
          this._rotation = new Quat();
          // 摄像机旋转四元素
          this._radius = 10;
        }
        get radius() {
          return this._targetRadius;
        }
        set radius(v) {
          this._targetRadius = v;
        }
        get target() {
          return this._target;
        }
        set target(v) {
          this._target = v;
          this._targetRotation.set(this._startRotation);
          this._targetCenter.set(v.worldPosition);
        }
        get targetRotation() {
          {
            this._startRotation.set(this._targetRotation);
          }
          return this._startRotation;
        }
        set targetRotation(v) {
          this._targetRotation.set(v);
          this._startRotation.set(v);
        }
        // 当前玩家与目标半径距离

        start() {
          if (this.enableTouch) {
            input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
            input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          }
          if (this.enableScaleRadius) {
            input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
          }
          if (this.target) this.resetTargetRotation();

          // 根据欧拉角信息计算摄像机四元数，旋转顺序为 YZX
          Quat.fromEuler(this._rotation, this._targetRotation.x, this._targetRotation.y, this._targetRotation.z);
          if (this.target) {
            this._targetCenter.set(this.target.worldPosition);
            this._center.set(this._targetCenter);
          }
          this._radius = this.radius;
          this.limitRotation();
        }

        /** 重置摄像机到初始位置 */
        resetTargetRotation() {
          let targetRotation = this._targetRotation.set(this._startRotation);
          if (this.followTargetRotationY) {
            targetRotation = tempVec3_2.set(targetRotation);
            Quat.toEuler(tempVec3, this.target.worldRotation);
            targetRotation.add(tempVec3);
          }
        }

        /** 限制 X 轴旋转（上下看） */
        limitRotation() {
          let rotation = this._targetRotation;
          if (rotation.x < this.xRotationRange.x) {
            rotation.x = this.xRotationRange.x;
          } else if (rotation.x > this.xRotationRange.y) {
            rotation.x = this.xRotationRange.y;
          }
          rotation.z = 0;
        }

        //#region Touch
        onTouchStart() {
          this._touched = true;
        }
        onTouchMove(event) {
          if (!this._touched) return;
          let delta = event.touch.getDelta();
          Quat.fromEuler(tempQuat, this._targetRotation.x, this._targetRotation.y, this._targetRotation.z);
          Quat.rotateX(tempQuat, tempQuat, -delta.y * DeltaFactor);
          Quat.rotateY(tempQuat, tempQuat, -delta.x * DeltaFactor);
          Quat.toEuler(this._targetRotation, tempQuat);
          this.limitRotation();
        }
        onTouchEnd() {
          this._touched = false;
        }
        //#endregion

        onMouseWheel(event) {
          let scrollY = event.getScrollY();
          this._targetRadius += this.radiusScaleSpeed * -Math.sign(scrollY); // 滚轮向前为负，滚轮向后为正
          this._targetRadius = Math.min(this.maxRadius, Math.max(this.minRadius, this._targetRadius));
        }
        update(dt) {
          let targetRotation = this._targetRotation;
          // 是否摄像机围绕 Y 轴自动旋转
          if (this.autoRotate && !this._touched) {
            targetRotation.y += this.autoRotateSpeed * dt;
          }
          if (this.target) {
            // 重置摄像机中心点
            this._targetCenter.set(this.target.worldPosition);

            // 是否跟随 Y 轴目标旋转
            if (this.followTargetRotationY) {
              targetRotation = tempVec3_2.set(targetRotation);
              Quat.toEuler(tempVec3, this.target.worldRotation);
              targetRotation.y += tempVec3.y; // 运行时，只变化 Y 旋转
            }
          }

          Quat.fromEuler(tempQuat, targetRotation.x, targetRotation.y, targetRotation.z); // 获取目标对象的旋转四元素（人物面向与摄像机一至）

          Quat.slerp(this._rotation, this._rotation, tempQuat, dt * 7 * this.rotateSpeed); // 旋转线性插值（平滑摄像机视口旋转）
          Vec3.lerp(this._center, this._center, this._targetCenter, dt * 5 * this.followSpeed); // 摄像机跟随位移线性插值（平滑摄像机节点位置移动）

          this._radius = lerp(this._radius, this._targetRadius, dt * 5); // 摄像机与目标距离半径线性插值（镜头平滑前后移动)

          Vec3.transformQuat(tempVec3, Vec3.FORWARD, this._rotation); // 计算摄像机旋转后的方向量
          Vec3.multiplyScalar(tempVec3, tempVec3, this._radius); // 计算摄像机与目标半径向量
          tempVec3.add(this._center); // 计算摄像机与目标偏移后的位置

          this.node.position = tempVec3; // 设置摄像机位置
          this.node.lookAt(this._center); // 设置摄像机视口方向
        }

        /** 摄像机立即跟随到制定目标的位置 */
        follow() {
          let targetRotation = this._targetRotation;
          if (this.target) {
            // 重置摄像机中心点
            this._targetCenter.set(this.target.worldPosition);

            // 是否跟随 Y 轴目标旋转
            if (this.followTargetRotationY) {
              targetRotation = tempVec3_2.set(targetRotation);
              Quat.toEuler(tempVec3, this.target.worldRotation);
              targetRotation.y += tempVec3.y; // 运行时，只变化 Y 旋转
            }
          }

          Quat.fromEuler(tempQuat, targetRotation.x, targetRotation.y, targetRotation.z); // 获取目标对象的旋转四元素（人物面向与摄像机一至）

          this._rotation = tempQuat;
          this._center = this._targetCenter;
          this._radius = this._targetRadius;
          Vec3.transformQuat(tempVec3, Vec3.FORWARD, this._rotation); // 计算摄像机旋转后的方向量
          Vec3.multiplyScalar(tempVec3, tempVec3, this._radius); // 计算摄像机与目标半径向量
          tempVec3.add(this._center); // 计算摄像机与目标偏移后的位置

          this.node.position = tempVec3; // 设置摄像机位置
          this.node.lookAt(this._center); // 设置摄像机视口方向
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enableTouch", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "enableScaleRadius", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "radiusScaleSpeed", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "minRadius", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "maxRadius", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "autoRotate", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "autoRotateSpeed", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 90;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "rotateSpeed", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "followSpeed", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "xRotationRange", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec2(5, 70);
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_targetRadius", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "radius", [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "radius"), _class2.prototype), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_target", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "target", [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "target"), _class2.prototype), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "_startRotation", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3();
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "targetRotation", [_dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "targetRotation"), _class2.prototype), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "followTargetRotationY", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/pako.min.js", ['./cjs-loader.mjs'], function (exports, module) {
  var loader;
  return {
    setters: [function (module) {
      loader = module.default;
    }],
    execute: function () {
      exports('default', void 0);
      let _cjsExports;
      const __cjsMetaURL = exports('__cjsMetaURL', module.meta.url);
      loader.define(__cjsMetaURL, function (exports$1, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE

        !function (t) {
          if ('object' == typeof exports$1 && 'undefined' != typeof module) module.exports = t();else if ('function' == typeof define && define.amd) define([], t);else {
            ('undefined' != typeof window ? window : 'undefined' != typeof global ? global : 'undefined' != typeof self ? self : this).pako = t();
          }
        }(function () {
          return function r(s, o, l) {
            function h(e, t) {
              if (!o[e]) {
                if (!s[e]) {
                  var a = 'function' == typeof require && require;
                  if (!t && a) return a(e, !0);
                  if (d) return d(e, !0);
                  var i = new Error("Cannot find module '" + e + "'");
                  throw i.code = 'MODULE_NOT_FOUND', i;
                }
                var n = o[e] = {
                  exports: {}
                };
                s[e][0].call(n.exports, function (t) {
                  return h(s[e][1][t] || t);
                }, n, n.exports, r, s, o, l);
              }
              return o[e].exports;
            }
            for (var d = 'function' == typeof require && require, t = 0; t < l.length; t++) h(l[t]);
            return h;
          }({
            1: [function (t, e, a) {
              var s = t('./zlib/deflate'),
                o = t('./utils/common'),
                l = t('./utils/strings'),
                n = t('./zlib/messages'),
                r = t('./zlib/zstream'),
                h = Object.prototype.toString,
                d = 0,
                f = -1,
                _ = 0,
                u = 8;
              function c(t) {
                if (!(this instanceof c)) return new c(t);
                this.options = o.assign({
                  level: f,
                  method: u,
                  chunkSize: 16384,
                  windowBits: 15,
                  memLevel: 8,
                  strategy: _,
                  to: ''
                }, t || {});
                var e = this.options;
                e.raw && 0 < e.windowBits ? e.windowBits = -e.windowBits : e.gzip && 0 < e.windowBits && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = '', this.ended = !1, this.chunks = [], this.strm = new r(), this.strm.avail_out = 0;
                var a = s.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);
                if (a !== d) throw new Error(n[a]);
                if (e.header && s.deflateSetHeader(this.strm, e.header), e.dictionary) {
                  var i;
                  if (i = 'string' == typeof e.dictionary ? l.string2buf(e.dictionary) : '[object ArrayBuffer]' === h.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary, (a = s.deflateSetDictionary(this.strm, i)) !== d) throw new Error(n[a]);
                  this._dict_set = !0;
                }
              }
              function i(t, e) {
                var a = new c(e);
                if (a.push(t, !0), a.err) throw a.msg || n[a.err];
                return a.result;
              }
              c.prototype.push = function (t, e) {
                var a,
                  i,
                  n = this.strm,
                  r = this.options.chunkSize;
                if (this.ended) return !1;
                i = e === ~~e ? e : !0 === e ? 4 : 0, 'string' == typeof t ? n.input = l.string2buf(t) : '[object ArrayBuffer]' === h.call(t) ? n.input = new Uint8Array(t) : n.input = t, n.next_in = 0, n.avail_in = n.input.length;
                do {
                  if (0 === n.avail_out && (n.output = new o.Buf8(r), n.next_out = 0, n.avail_out = r), 1 !== (a = s.deflate(n, i)) && a !== d) return this.onEnd(a), !(this.ended = !0);
                  0 !== n.avail_out && (0 !== n.avail_in || 4 !== i && 2 !== i) || ('string' === this.options.to ? this.onData(l.buf2binstring(o.shrinkBuf(n.output, n.next_out))) : this.onData(o.shrinkBuf(n.output, n.next_out)));
                } while ((0 < n.avail_in || 0 === n.avail_out) && 1 !== a);
                return 4 === i ? (a = s.deflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === d) : 2 !== i || (this.onEnd(d), !(n.avail_out = 0));
              }, c.prototype.onData = function (t) {
                this.chunks.push(t);
              }, c.prototype.onEnd = function (t) {
                t === d && ('string' === this.options.to ? this.result = this.chunks.join('') : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
              }, a.Deflate = c, a.deflate = i, a.deflateRaw = function (t, e) {
                return (e = e || {}).raw = !0, i(t, e);
              }, a.gzip = function (t, e) {
                return (e = e || {}).gzip = !0, i(t, e);
              };
            }, {
              './utils/common': 3,
              './utils/strings': 4,
              './zlib/deflate': 8,
              './zlib/messages': 13,
              './zlib/zstream': 15
            }],
            2: [function (t, e, a) {
              var f = t('./zlib/inflate'),
                _ = t('./utils/common'),
                u = t('./utils/strings'),
                c = t('./zlib/constants'),
                i = t('./zlib/messages'),
                n = t('./zlib/zstream'),
                r = t('./zlib/gzheader'),
                b = Object.prototype.toString;
              function s(t) {
                if (!(this instanceof s)) return new s(t);
                this.options = _.assign({
                  chunkSize: 16384,
                  windowBits: 0,
                  to: ''
                }, t || {});
                var e = this.options;
                e.raw && 0 <= e.windowBits && e.windowBits < 16 && (e.windowBits = -e.windowBits, 0 === e.windowBits && (e.windowBits = -15)), !(0 <= e.windowBits && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32), 15 < e.windowBits && e.windowBits < 48 && 0 == (15 & e.windowBits) && (e.windowBits |= 15), this.err = 0, this.msg = '', this.ended = !1, this.chunks = [], this.strm = new n(), this.strm.avail_out = 0;
                var a = f.inflateInit2(this.strm, e.windowBits);
                if (a !== c.Z_OK) throw new Error(i[a]);
                if (this.header = new r(), f.inflateGetHeader(this.strm, this.header), e.dictionary && ('string' == typeof e.dictionary ? e.dictionary = u.string2buf(e.dictionary) : '[object ArrayBuffer]' === b.call(e.dictionary) && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (a = f.inflateSetDictionary(this.strm, e.dictionary)) !== c.Z_OK)) throw new Error(i[a]);
              }
              function o(t, e) {
                var a = new s(e);
                if (a.push(t, !0), a.err) throw a.msg || i[a.err];
                return a.result;
              }
              s.prototype.push = function (t, e) {
                var a,
                  i,
                  n,
                  r,
                  s,
                  o = this.strm,
                  l = this.options.chunkSize,
                  h = this.options.dictionary,
                  d = !1;
                if (this.ended) return !1;
                i = e === ~~e ? e : !0 === e ? c.Z_FINISH : c.Z_NO_FLUSH, 'string' == typeof t ? o.input = u.binstring2buf(t) : '[object ArrayBuffer]' === b.call(t) ? o.input = new Uint8Array(t) : o.input = t, o.next_in = 0, o.avail_in = o.input.length;
                do {
                  if (0 === o.avail_out && (o.output = new _.Buf8(l), o.next_out = 0, o.avail_out = l), (a = f.inflate(o, c.Z_NO_FLUSH)) === c.Z_NEED_DICT && h && (a = f.inflateSetDictionary(this.strm, h)), a === c.Z_BUF_ERROR && !0 === d && (a = c.Z_OK, d = !1), a !== c.Z_STREAM_END && a !== c.Z_OK) return this.onEnd(a), !(this.ended = !0);
                  o.next_out && (0 !== o.avail_out && a !== c.Z_STREAM_END && (0 !== o.avail_in || i !== c.Z_FINISH && i !== c.Z_SYNC_FLUSH) || ('string' === this.options.to ? (n = u.utf8border(o.output, o.next_out), r = o.next_out - n, s = u.buf2string(o.output, n), o.next_out = r, o.avail_out = l - r, r && _.arraySet(o.output, o.output, n, r, 0), this.onData(s)) : this.onData(_.shrinkBuf(o.output, o.next_out)))), 0 === o.avail_in && 0 === o.avail_out && (d = !0);
                } while ((0 < o.avail_in || 0 === o.avail_out) && a !== c.Z_STREAM_END);
                return a === c.Z_STREAM_END && (i = c.Z_FINISH), i === c.Z_FINISH ? (a = f.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === c.Z_OK) : i !== c.Z_SYNC_FLUSH || (this.onEnd(c.Z_OK), !(o.avail_out = 0));
              }, s.prototype.onData = function (t) {
                this.chunks.push(t);
              }, s.prototype.onEnd = function (t) {
                t === c.Z_OK && ('string' === this.options.to ? this.result = this.chunks.join('') : this.result = _.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
              }, a.Inflate = s, a.inflate = o, a.inflateRaw = function (t, e) {
                return (e = e || {}).raw = !0, o(t, e);
              }, a.ungzip = o;
            }, {
              './utils/common': 3,
              './utils/strings': 4,
              './zlib/constants': 6,
              './zlib/gzheader': 9,
              './zlib/inflate': 11,
              './zlib/messages': 13,
              './zlib/zstream': 15
            }],
            3: [function (t, e, a) {
              var i = 'undefined' != typeof Uint8Array && 'undefined' != typeof Uint16Array && 'undefined' != typeof Int32Array;
              a.assign = function (t) {
                for (var e, a, i = Array.prototype.slice.call(arguments, 1); i.length;) {
                  var n = i.shift();
                  if (n) {
                    if ('object' != typeof n) throw new TypeError(n + 'must be non-object');
                    for (var r in n) e = n, a = r, Object.prototype.hasOwnProperty.call(e, a) && (t[r] = n[r]);
                  }
                }
                return t;
              }, a.shrinkBuf = function (t, e) {
                return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e, t);
              };
              var n = {
                  arraySet: function (t, e, a, i, n) {
                    if (e.subarray && t.subarray) t.set(e.subarray(a, a + i), n);else for (var r = 0; r < i; r++) t[n + r] = e[a + r];
                  },
                  flattenChunks: function (t) {
                    var e, a, i, n, r, s;
                    for (e = i = 0, a = t.length; e < a; e++) i += t[e].length;
                    for (s = new Uint8Array(i), e = n = 0, a = t.length; e < a; e++) r = t[e], s.set(r, n), n += r.length;
                    return s;
                  }
                },
                r = {
                  arraySet: function (t, e, a, i, n) {
                    for (var r = 0; r < i; r++) t[n + r] = e[a + r];
                  },
                  flattenChunks: function (t) {
                    return [].concat.apply([], t);
                  }
                };
              a.setTyped = function (t) {
                t ? (a.Buf8 = Uint8Array, a.Buf16 = Uint16Array, a.Buf32 = Int32Array, a.assign(a, n)) : (a.Buf8 = Array, a.Buf16 = Array, a.Buf32 = Array, a.assign(a, r));
              }, a.setTyped(i);
            }, {}],
            4: [function (t, e, a) {
              var l = t('./common'),
                n = !0,
                r = !0;
              try {
                String.fromCharCode.apply(null, [0]);
              } catch (t) {
                n = !1;
              }
              try {
                String.fromCharCode.apply(null, new Uint8Array(1));
              } catch (t) {
                r = !1;
              }
              for (var h = new l.Buf8(256), i = 0; i < 256; i++) h[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
              function d(t, e) {
                if (e < 65534 && (t.subarray && r || !t.subarray && n)) return String.fromCharCode.apply(null, l.shrinkBuf(t, e));
                for (var a = '', i = 0; i < e; i++) a += String.fromCharCode(t[i]);
                return a;
              }
              h[254] = h[254] = 1, a.string2buf = function (t) {
                var e,
                  a,
                  i,
                  n,
                  r,
                  s = t.length,
                  o = 0;
                for (n = 0; n < s; n++) 55296 == (64512 & (a = t.charCodeAt(n))) && n + 1 < s && 56320 == (64512 & (i = t.charCodeAt(n + 1))) && (a = 65536 + (a - 55296 << 10) + (i - 56320), n++), o += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4;
                for (e = new l.Buf8(o), n = r = 0; r < o; n++) 55296 == (64512 & (a = t.charCodeAt(n))) && n + 1 < s && 56320 == (64512 & (i = t.charCodeAt(n + 1))) && (a = 65536 + (a - 55296 << 10) + (i - 56320), n++), a < 128 ? e[r++] = a : (a < 2048 ? e[r++] = 192 | a >>> 6 : (a < 65536 ? e[r++] = 224 | a >>> 12 : (e[r++] = 240 | a >>> 18, e[r++] = 128 | a >>> 12 & 63), e[r++] = 128 | a >>> 6 & 63), e[r++] = 128 | 63 & a);
                return e;
              }, a.buf2binstring = function (t) {
                return d(t, t.length);
              }, a.binstring2buf = function (t) {
                for (var e = new l.Buf8(t.length), a = 0, i = e.length; a < i; a++) e[a] = t.charCodeAt(a);
                return e;
              }, a.buf2string = function (t, e) {
                var a,
                  i,
                  n,
                  r,
                  s = e || t.length,
                  o = new Array(2 * s);
                for (a = i = 0; a < s;) if ((n = t[a++]) < 128) o[i++] = n;else if (4 < (r = h[n])) o[i++] = 65533, a += r - 1;else {
                  for (n &= 2 === r ? 31 : 3 === r ? 15 : 7; 1 < r && a < s;) n = n << 6 | 63 & t[a++], r--;
                  1 < r ? o[i++] = 65533 : n < 65536 ? o[i++] = n : (n -= 65536, o[i++] = 55296 | n >> 10 & 1023, o[i++] = 56320 | 1023 & n);
                }
                return d(o, i);
              }, a.utf8border = function (t, e) {
                var a;
                for ((e = e || t.length) > t.length && (e = t.length), a = e - 1; 0 <= a && 128 == (192 & t[a]);) a--;
                return a < 0 ? e : 0 === a ? e : a + h[t[a]] > e ? a : e;
              };
            }, {
              './common': 3
            }],
            5: [function (t, e, a) {
              e.exports = function (t, e, a, i) {
                for (var n = 65535 & t | 0, r = t >>> 16 & 65535 | 0, s = 0; 0 !== a;) {
                  for (a -= s = 2e3 < a ? 2e3 : a; r = r + (n = n + e[i++] | 0) | 0, --s;);
                  n %= 65521, r %= 65521;
                }
                return n | r << 16 | 0;
              };
            }, {}],
            6: [function (t, e, a) {
              e.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8
              };
            }, {}],
            7: [function (t, e, a) {
              var o = function () {
                for (var t, e = [], a = 0; a < 256; a++) {
                  t = a;
                  for (var i = 0; i < 8; i++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
                  e[a] = t;
                }
                return e;
              }();
              e.exports = function (t, e, a, i) {
                var n = o,
                  r = i + a;
                t ^= -1;
                for (var s = i; s < r; s++) t = t >>> 8 ^ n[255 & (t ^ e[s])];
                return -1 ^ t;
              };
            }, {}],
            8: [function (t, e, a) {
              var l,
                _ = t('../utils/common'),
                h = t('./trees'),
                u = t('./adler32'),
                c = t('./crc32'),
                i = t('./messages'),
                d = 0,
                f = 4,
                b = 0,
                g = -2,
                m = -1,
                w = 4,
                n = 2,
                p = 8,
                v = 9,
                r = 286,
                s = 30,
                o = 19,
                k = 2 * r + 1,
                y = 15,
                x = 3,
                z = 258,
                B = z + x + 1,
                S = 42,
                E = 113,
                A = 1,
                Z = 2,
                R = 3,
                C = 4;
              function N(t, e) {
                return t.msg = i[e], e;
              }
              function O(t) {
                return (t << 1) - (4 < t ? 9 : 0);
              }
              function D(t) {
                for (var e = t.length; 0 <= --e;) t[e] = 0;
              }
              function I(t) {
                var e = t.state,
                  a = e.pending;
                a > t.avail_out && (a = t.avail_out), 0 !== a && (_.arraySet(t.output, e.pending_buf, e.pending_out, a, t.next_out), t.next_out += a, e.pending_out += a, t.total_out += a, t.avail_out -= a, e.pending -= a, 0 === e.pending && (e.pending_out = 0));
              }
              function U(t, e) {
                h._tr_flush_block(t, 0 <= t.block_start ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, I(t.strm);
              }
              function T(t, e) {
                t.pending_buf[t.pending++] = e;
              }
              function F(t, e) {
                t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e;
              }
              function L(t, e) {
                var a,
                  i,
                  n = t.max_chain_length,
                  r = t.strstart,
                  s = t.prev_length,
                  o = t.nice_match,
                  l = t.strstart > t.w_size - B ? t.strstart - (t.w_size - B) : 0,
                  h = t.window,
                  d = t.w_mask,
                  f = t.prev,
                  _ = t.strstart + z,
                  u = h[r + s - 1],
                  c = h[r + s];
                t.prev_length >= t.good_match && (n >>= 2), o > t.lookahead && (o = t.lookahead);
                do {
                  if (h[(a = e) + s] === c && h[a + s - 1] === u && h[a] === h[r] && h[++a] === h[r + 1]) {
                    r += 2, a++;
                    do {} while (h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && r < _);
                    if (i = z - (_ - r), r = _ - z, s < i) {
                      if (t.match_start = e, o <= (s = i)) break;
                      u = h[r + s - 1], c = h[r + s];
                    }
                  }
                } while ((e = f[e & d]) > l && 0 != --n);
                return s <= t.lookahead ? s : t.lookahead;
              }
              function H(t) {
                var e,
                  a,
                  i,
                  n,
                  r,
                  s,
                  o,
                  l,
                  h,
                  d,
                  f = t.w_size;
                do {
                  if (n = t.window_size - t.lookahead - t.strstart, t.strstart >= f + (f - B)) {
                    for (_.arraySet(t.window, t.window, f, f, 0), t.match_start -= f, t.strstart -= f, t.block_start -= f, e = a = t.hash_size; i = t.head[--e], t.head[e] = f <= i ? i - f : 0, --a;);
                    for (e = a = f; i = t.prev[--e], t.prev[e] = f <= i ? i - f : 0, --a;);
                    n += f;
                  }
                  if (0 === t.strm.avail_in) break;
                  if (s = t.strm, o = t.window, l = t.strstart + t.lookahead, h = n, d = void 0, d = s.avail_in, h < d && (d = h), a = 0 === d ? 0 : (s.avail_in -= d, _.arraySet(o, s.input, s.next_in, d, l), 1 === s.state.wrap ? s.adler = u(s.adler, o, d, l) : 2 === s.state.wrap && (s.adler = c(s.adler, o, d, l)), s.next_in += d, s.total_in += d, d), t.lookahead += a, t.lookahead + t.insert >= x) for (r = t.strstart - t.insert, t.ins_h = t.window[r], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[r + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[r + x - 1]) & t.hash_mask, t.prev[r & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = r, r++, t.insert--, !(t.lookahead + t.insert < x)););
                } while (t.lookahead < B && 0 !== t.strm.avail_in);
              }
              function j(t, e) {
                for (var a, i;;) {
                  if (t.lookahead < B) {
                    if (H(t), t.lookahead < B && e === d) return A;
                    if (0 === t.lookahead) break;
                  }
                  if (a = 0, t.lookahead >= x && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + x - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== a && t.strstart - a <= t.w_size - B && (t.match_length = L(t, a)), t.match_length >= x) {
                    if (i = h._tr_tally(t, t.strstart - t.match_start, t.match_length - x), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= x) {
                      for (t.match_length--; t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + x - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart, 0 != --t.match_length;);
                      t.strstart++;
                    } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
                  } else i = h._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
                  if (i && (U(t, !1), 0 === t.strm.avail_out)) return A;
                }
                return t.insert = t.strstart < x - 1 ? t.strstart : x - 1, e === f ? (U(t, !0), 0 === t.strm.avail_out ? R : C) : t.last_lit && (U(t, !1), 0 === t.strm.avail_out) ? A : Z;
              }
              function K(t, e) {
                for (var a, i, n;;) {
                  if (t.lookahead < B) {
                    if (H(t), t.lookahead < B && e === d) return A;
                    if (0 === t.lookahead) break;
                  }
                  if (a = 0, t.lookahead >= x && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + x - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = x - 1, 0 !== a && t.prev_length < t.max_lazy_match && t.strstart - a <= t.w_size - B && (t.match_length = L(t, a), t.match_length <= 5 && (1 === t.strategy || t.match_length === x && 4096 < t.strstart - t.match_start) && (t.match_length = x - 1)), t.prev_length >= x && t.match_length <= t.prev_length) {
                    for (n = t.strstart + t.lookahead - x, i = h._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - x), t.lookahead -= t.prev_length - 1, t.prev_length -= 2; ++t.strstart <= n && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + x - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 != --t.prev_length;);
                    if (t.match_available = 0, t.match_length = x - 1, t.strstart++, i && (U(t, !1), 0 === t.strm.avail_out)) return A;
                  } else if (t.match_available) {
                    if ((i = h._tr_tally(t, 0, t.window[t.strstart - 1])) && U(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return A;
                  } else t.match_available = 1, t.strstart++, t.lookahead--;
                }
                return t.match_available && (i = h._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < x - 1 ? t.strstart : x - 1, e === f ? (U(t, !0), 0 === t.strm.avail_out ? R : C) : t.last_lit && (U(t, !1), 0 === t.strm.avail_out) ? A : Z;
              }
              function M(t, e, a, i, n) {
                this.good_length = t, this.max_lazy = e, this.nice_length = a, this.max_chain = i, this.func = n;
              }
              function P() {
                this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = p, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new _.Buf16(2 * k), this.dyn_dtree = new _.Buf16(2 * (2 * s + 1)), this.bl_tree = new _.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new _.Buf16(y + 1), this.heap = new _.Buf16(2 * r + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new _.Buf16(2 * r + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
              }
              function Y(t) {
                var e;
                return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = n, (e = t.state).pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? S : E, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = d, h._tr_init(e), b) : N(t, g);
              }
              function q(t) {
                var e,
                  a = Y(t);
                return a === b && ((e = t.state).window_size = 2 * e.w_size, D(e.head), e.max_lazy_match = l[e.level].max_lazy, e.good_match = l[e.level].good_length, e.nice_match = l[e.level].nice_length, e.max_chain_length = l[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = x - 1, e.match_available = 0, e.ins_h = 0), a;
              }
              function G(t, e, a, i, n, r) {
                if (!t) return g;
                var s = 1;
                if (e === m && (e = 6), i < 0 ? (s = 0, i = -i) : 15 < i && (s = 2, i -= 16), n < 1 || v < n || a !== p || i < 8 || 15 < i || e < 0 || 9 < e || r < 0 || w < r) return N(t, g);
                8 === i && (i = 9);
                var o = new P();
                return (t.state = o).strm = t, o.wrap = s, o.gzhead = null, o.w_bits = i, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = n + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + x - 1) / x), o.window = new _.Buf8(2 * o.w_size), o.head = new _.Buf16(o.hash_size), o.prev = new _.Buf16(o.w_size), o.lit_bufsize = 1 << n + 6, o.pending_buf_size = 4 * o.lit_bufsize, o.pending_buf = new _.Buf8(o.pending_buf_size), o.d_buf = 1 * o.lit_bufsize, o.l_buf = 3 * o.lit_bufsize, o.level = e, o.strategy = r, o.method = a, q(t);
              }
              l = [new M(0, 0, 0, 0, function (t, e) {
                var a = 65535;
                for (a > t.pending_buf_size - 5 && (a = t.pending_buf_size - 5);;) {
                  if (t.lookahead <= 1) {
                    if (H(t), 0 === t.lookahead && e === d) return A;
                    if (0 === t.lookahead) break;
                  }
                  t.strstart += t.lookahead, t.lookahead = 0;
                  var i = t.block_start + a;
                  if ((0 === t.strstart || t.strstart >= i) && (t.lookahead = t.strstart - i, t.strstart = i, U(t, !1), 0 === t.strm.avail_out)) return A;
                  if (t.strstart - t.block_start >= t.w_size - B && (U(t, !1), 0 === t.strm.avail_out)) return A;
                }
                return t.insert = 0, e === f ? (U(t, !0), 0 === t.strm.avail_out ? R : C) : (t.strstart > t.block_start && (U(t, !1), t.strm.avail_out), A);
              }), new M(4, 4, 8, 4, j), new M(4, 5, 16, 8, j), new M(4, 6, 32, 32, j), new M(4, 4, 16, 16, K), new M(8, 16, 32, 32, K), new M(8, 16, 128, 128, K), new M(8, 32, 128, 256, K), new M(32, 128, 258, 1024, K), new M(32, 258, 258, 4096, K)], a.deflateInit = function (t, e) {
                return G(t, e, p, 15, 8, 0);
              }, a.deflateInit2 = G, a.deflateReset = q, a.deflateResetKeep = Y, a.deflateSetHeader = function (t, e) {
                return t && t.state ? 2 !== t.state.wrap ? g : (t.state.gzhead = e, b) : g;
              }, a.deflate = function (t, e) {
                var a, i, n, r;
                if (!t || !t.state || 5 < e || e < 0) return t ? N(t, g) : g;
                if (i = t.state, !t.output || !t.input && 0 !== t.avail_in || 666 === i.status && e !== f) return N(t, 0 === t.avail_out ? -5 : g);
                if (i.strm = t, a = i.last_flush, i.last_flush = e, i.status === S) if (2 === i.wrap) t.adler = 0, T(i, 31), T(i, 139), T(i, 8), i.gzhead ? (T(i, (i.gzhead.text ? 1 : 0) + (i.gzhead.hcrc ? 2 : 0) + (i.gzhead.extra ? 4 : 0) + (i.gzhead.name ? 8 : 0) + (i.gzhead.comment ? 16 : 0)), T(i, 255 & i.gzhead.time), T(i, i.gzhead.time >> 8 & 255), T(i, i.gzhead.time >> 16 & 255), T(i, i.gzhead.time >> 24 & 255), T(i, 9 === i.level ? 2 : 2 <= i.strategy || i.level < 2 ? 4 : 0), T(i, 255 & i.gzhead.os), i.gzhead.extra && i.gzhead.extra.length && (T(i, 255 & i.gzhead.extra.length), T(i, i.gzhead.extra.length >> 8 & 255)), i.gzhead.hcrc && (t.adler = c(t.adler, i.pending_buf, i.pending, 0)), i.gzindex = 0, i.status = 69) : (T(i, 0), T(i, 0), T(i, 0), T(i, 0), T(i, 0), T(i, 9 === i.level ? 2 : 2 <= i.strategy || i.level < 2 ? 4 : 0), T(i, 3), i.status = E);else {
                  var s = p + (i.w_bits - 8 << 4) << 8;
                  s |= (2 <= i.strategy || i.level < 2 ? 0 : i.level < 6 ? 1 : 6 === i.level ? 2 : 3) << 6, 0 !== i.strstart && (s |= 32), s += 31 - s % 31, i.status = E, F(i, s), 0 !== i.strstart && (F(i, t.adler >>> 16), F(i, 65535 & t.adler)), t.adler = 1;
                }
                if (69 === i.status) if (i.gzhead.extra) {
                  for (n = i.pending; i.gzindex < (65535 & i.gzhead.extra.length) && (i.pending !== i.pending_buf_size || (i.gzhead.hcrc && i.pending > n && (t.adler = c(t.adler, i.pending_buf, i.pending - n, n)), I(t), n = i.pending, i.pending !== i.pending_buf_size));) T(i, 255 & i.gzhead.extra[i.gzindex]), i.gzindex++;
                  i.gzhead.hcrc && i.pending > n && (t.adler = c(t.adler, i.pending_buf, i.pending - n, n)), i.gzindex === i.gzhead.extra.length && (i.gzindex = 0, i.status = 73);
                } else i.status = 73;
                if (73 === i.status) if (i.gzhead.name) {
                  n = i.pending;
                  do {
                    if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (t.adler = c(t.adler, i.pending_buf, i.pending - n, n)), I(t), n = i.pending, i.pending === i.pending_buf_size)) {
                      r = 1;
                      break;
                    }
                    T(i, r = i.gzindex < i.gzhead.name.length ? 255 & i.gzhead.name.charCodeAt(i.gzindex++) : 0);
                  } while (0 !== r);
                  i.gzhead.hcrc && i.pending > n && (t.adler = c(t.adler, i.pending_buf, i.pending - n, n)), 0 === r && (i.gzindex = 0, i.status = 91);
                } else i.status = 91;
                if (91 === i.status) if (i.gzhead.comment) {
                  n = i.pending;
                  do {
                    if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (t.adler = c(t.adler, i.pending_buf, i.pending - n, n)), I(t), n = i.pending, i.pending === i.pending_buf_size)) {
                      r = 1;
                      break;
                    }
                    T(i, r = i.gzindex < i.gzhead.comment.length ? 255 & i.gzhead.comment.charCodeAt(i.gzindex++) : 0);
                  } while (0 !== r);
                  i.gzhead.hcrc && i.pending > n && (t.adler = c(t.adler, i.pending_buf, i.pending - n, n)), 0 === r && (i.status = 103);
                } else i.status = 103;
                if (103 === i.status && (i.gzhead.hcrc ? (i.pending + 2 > i.pending_buf_size && I(t), i.pending + 2 <= i.pending_buf_size && (T(i, 255 & t.adler), T(i, t.adler >> 8 & 255), t.adler = 0, i.status = E)) : i.status = E), 0 !== i.pending) {
                  if (I(t), 0 === t.avail_out) return i.last_flush = -1, b;
                } else if (0 === t.avail_in && O(e) <= O(a) && e !== f) return N(t, -5);
                if (666 === i.status && 0 !== t.avail_in) return N(t, -5);
                if (0 !== t.avail_in || 0 !== i.lookahead || e !== d && 666 !== i.status) {
                  var o = 2 === i.strategy ? function (t, e) {
                    for (var a;;) {
                      if (0 === t.lookahead && (H(t), 0 === t.lookahead)) {
                        if (e === d) return A;
                        break;
                      }
                      if (t.match_length = 0, a = h._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, a && (U(t, !1), 0 === t.strm.avail_out)) return A;
                    }
                    return t.insert = 0, e === f ? (U(t, !0), 0 === t.strm.avail_out ? R : C) : t.last_lit && (U(t, !1), 0 === t.strm.avail_out) ? A : Z;
                  }(i, e) : 3 === i.strategy ? function (t, e) {
                    for (var a, i, n, r, s = t.window;;) {
                      if (t.lookahead <= z) {
                        if (H(t), t.lookahead <= z && e === d) return A;
                        if (0 === t.lookahead) break;
                      }
                      if (t.match_length = 0, t.lookahead >= x && 0 < t.strstart && (i = s[n = t.strstart - 1]) === s[++n] && i === s[++n] && i === s[++n]) {
                        r = t.strstart + z;
                        do {} while (i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && n < r);
                        t.match_length = z - (r - n), t.match_length > t.lookahead && (t.match_length = t.lookahead);
                      }
                      if (t.match_length >= x ? (a = h._tr_tally(t, 1, t.match_length - x), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (a = h._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), a && (U(t, !1), 0 === t.strm.avail_out)) return A;
                    }
                    return t.insert = 0, e === f ? (U(t, !0), 0 === t.strm.avail_out ? R : C) : t.last_lit && (U(t, !1), 0 === t.strm.avail_out) ? A : Z;
                  }(i, e) : l[i.level].func(i, e);
                  if (o !== R && o !== C || (i.status = 666), o === A || o === R) return 0 === t.avail_out && (i.last_flush = -1), b;
                  if (o === Z && (1 === e ? h._tr_align(i) : 5 !== e && (h._tr_stored_block(i, 0, 0, !1), 3 === e && (D(i.head), 0 === i.lookahead && (i.strstart = 0, i.block_start = 0, i.insert = 0))), I(t), 0 === t.avail_out)) return i.last_flush = -1, b;
                }
                return e !== f ? b : i.wrap <= 0 ? 1 : (2 === i.wrap ? (T(i, 255 & t.adler), T(i, t.adler >> 8 & 255), T(i, t.adler >> 16 & 255), T(i, t.adler >> 24 & 255), T(i, 255 & t.total_in), T(i, t.total_in >> 8 & 255), T(i, t.total_in >> 16 & 255), T(i, t.total_in >> 24 & 255)) : (F(i, t.adler >>> 16), F(i, 65535 & t.adler)), I(t), 0 < i.wrap && (i.wrap = -i.wrap), 0 !== i.pending ? b : 1);
              }, a.deflateEnd = function (t) {
                var e;
                return t && t.state ? (e = t.state.status) !== S && 69 !== e && 73 !== e && 91 !== e && 103 !== e && e !== E && 666 !== e ? N(t, g) : (t.state = null, e === E ? N(t, -3) : b) : g;
              }, a.deflateSetDictionary = function (t, e) {
                var a,
                  i,
                  n,
                  r,
                  s,
                  o,
                  l,
                  h,
                  d = e.length;
                if (!t || !t.state) return g;
                if (2 === (r = (a = t.state).wrap) || 1 === r && a.status !== S || a.lookahead) return g;
                for (1 === r && (t.adler = u(t.adler, e, d, 0)), a.wrap = 0, d >= a.w_size && (0 === r && (D(a.head), a.strstart = 0, a.block_start = 0, a.insert = 0), h = new _.Buf8(a.w_size), _.arraySet(h, e, d - a.w_size, a.w_size, 0), e = h, d = a.w_size), s = t.avail_in, o = t.next_in, l = t.input, t.avail_in = d, t.next_in = 0, t.input = e, H(a); a.lookahead >= x;) {
                  for (i = a.strstart, n = a.lookahead - (x - 1); a.ins_h = (a.ins_h << a.hash_shift ^ a.window[i + x - 1]) & a.hash_mask, a.prev[i & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = i, i++, --n;);
                  a.strstart = i, a.lookahead = x - 1, H(a);
                }
                return a.strstart += a.lookahead, a.block_start = a.strstart, a.insert = a.lookahead, a.lookahead = 0, a.match_length = a.prev_length = x - 1, a.match_available = 0, t.next_in = o, t.input = l, t.avail_in = s, a.wrap = r, b;
              }, a.deflateInfo = 'pako deflate (from Nodeca project)';
            }, {
              '../utils/common': 3,
              './adler32': 5,
              './crc32': 7,
              './messages': 13,
              './trees': 14
            }],
            9: [function (t, e, a) {
              e.exports = function () {
                this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = '', this.comment = '', this.hcrc = 0, this.done = !1;
              };
            }, {}],
            10: [function (t, e, a) {
              e.exports = function (t, e) {
                var a, i, n, r, s, o, l, h, d, f, _, u, c, b, g, m, w, p, v, k, y, x, z, B, S;
                a = t.state, i = t.next_in, B = t.input, n = i + (t.avail_in - 5), r = t.next_out, S = t.output, s = r - (e - t.avail_out), o = r + (t.avail_out - 257), l = a.dmax, h = a.wsize, d = a.whave, f = a.wnext, _ = a.window, u = a.hold, c = a.bits, b = a.lencode, g = a.distcode, m = (1 << a.lenbits) - 1, w = (1 << a.distbits) - 1;
                t: do {
                  c < 15 && (u += B[i++] << c, c += 8, u += B[i++] << c, c += 8), p = b[u & m];
                  e: for (;;) {
                    if (u >>>= v = p >>> 24, c -= v, 0 === (v = p >>> 16 & 255)) S[r++] = 65535 & p;else {
                      if (!(16 & v)) {
                        if (0 == (64 & v)) {
                          p = b[(65535 & p) + (u & (1 << v) - 1)];
                          continue e;
                        }
                        if (32 & v) {
                          a.mode = 12;
                          break t;
                        }
                        t.msg = 'invalid literal/length code', a.mode = 30;
                        break t;
                      }
                      k = 65535 & p, (v &= 15) && (c < v && (u += B[i++] << c, c += 8), k += u & (1 << v) - 1, u >>>= v, c -= v), c < 15 && (u += B[i++] << c, c += 8, u += B[i++] << c, c += 8), p = g[u & w];
                      a: for (;;) {
                        if (u >>>= v = p >>> 24, c -= v, !(16 & (v = p >>> 16 & 255))) {
                          if (0 == (64 & v)) {
                            p = g[(65535 & p) + (u & (1 << v) - 1)];
                            continue a;
                          }
                          t.msg = 'invalid distance code', a.mode = 30;
                          break t;
                        }
                        if (y = 65535 & p, c < (v &= 15) && (u += B[i++] << c, (c += 8) < v && (u += B[i++] << c, c += 8)), l < (y += u & (1 << v) - 1)) {
                          t.msg = 'invalid distance too far back', a.mode = 30;
                          break t;
                        }
                        if (u >>>= v, c -= v, (v = r - s) < y) {
                          if (d < (v = y - v) && a.sane) {
                            t.msg = 'invalid distance too far back', a.mode = 30;
                            break t;
                          }
                          if (z = _, (x = 0) === f) {
                            if (x += h - v, v < k) {
                              for (k -= v; S[r++] = _[x++], --v;);
                              x = r - y, z = S;
                            }
                          } else if (f < v) {
                            if (x += h + f - v, (v -= f) < k) {
                              for (k -= v; S[r++] = _[x++], --v;);
                              if (x = 0, f < k) {
                                for (k -= v = f; S[r++] = _[x++], --v;);
                                x = r - y, z = S;
                              }
                            }
                          } else if (x += f - v, v < k) {
                            for (k -= v; S[r++] = _[x++], --v;);
                            x = r - y, z = S;
                          }
                          for (; 2 < k;) S[r++] = z[x++], S[r++] = z[x++], S[r++] = z[x++], k -= 3;
                          k && (S[r++] = z[x++], 1 < k && (S[r++] = z[x++]));
                        } else {
                          for (x = r - y; S[r++] = S[x++], S[r++] = S[x++], S[r++] = S[x++], 2 < (k -= 3););
                          k && (S[r++] = S[x++], 1 < k && (S[r++] = S[x++]));
                        }
                        break;
                      }
                    }
                    break;
                  }
                } while (i < n && r < o);
                i -= k = c >> 3, u &= (1 << (c -= k << 3)) - 1, t.next_in = i, t.next_out = r, t.avail_in = i < n ? n - i + 5 : 5 - (i - n), t.avail_out = r < o ? o - r + 257 : 257 - (r - o), a.hold = u, a.bits = c;
              };
            }, {}],
            11: [function (t, e, a) {
              var Z = t('../utils/common'),
                R = t('./adler32'),
                C = t('./crc32'),
                N = t('./inffast'),
                O = t('./inftrees'),
                D = 1,
                I = 2,
                U = 0,
                T = -2,
                F = 1,
                i = 852,
                n = 592;
              function L(t) {
                return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24);
              }
              function r() {
                this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Z.Buf16(320), this.work = new Z.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
              }
              function s(t) {
                var e;
                return t && t.state ? (e = t.state, t.total_in = t.total_out = e.total = 0, t.msg = '', e.wrap && (t.adler = 1 & e.wrap), e.mode = F, e.last = 0, e.havedict = 0, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new Z.Buf32(i), e.distcode = e.distdyn = new Z.Buf32(n), e.sane = 1, e.back = -1, U) : T;
              }
              function o(t) {
                var e;
                return t && t.state ? ((e = t.state).wsize = 0, e.whave = 0, e.wnext = 0, s(t)) : T;
              }
              function l(t, e) {
                var a, i;
                return t && t.state ? (i = t.state, e < 0 ? (a = 0, e = -e) : (a = 1 + (e >> 4), e < 48 && (e &= 15)), e && (e < 8 || 15 < e) ? T : (null !== i.window && i.wbits !== e && (i.window = null), i.wrap = a, i.wbits = e, o(t))) : T;
              }
              function h(t, e) {
                var a, i;
                return t ? (i = new r(), (t.state = i).window = null, (a = l(t, e)) !== U && (t.state = null), a) : T;
              }
              var d,
                f,
                _ = !0;
              function H(t) {
                if (_) {
                  var e;
                  for (d = new Z.Buf32(512), f = new Z.Buf32(32), e = 0; e < 144;) t.lens[e++] = 8;
                  for (; e < 256;) t.lens[e++] = 9;
                  for (; e < 280;) t.lens[e++] = 7;
                  for (; e < 288;) t.lens[e++] = 8;
                  for (O(D, t.lens, 0, 288, d, 0, t.work, {
                    bits: 9
                  }), e = 0; e < 32;) t.lens[e++] = 5;
                  O(I, t.lens, 0, 32, f, 0, t.work, {
                    bits: 5
                  }), _ = !1;
                }
                t.lencode = d, t.lenbits = 9, t.distcode = f, t.distbits = 5;
              }
              function j(t, e, a, i) {
                var n,
                  r = t.state;
                return null === r.window && (r.wsize = 1 << r.wbits, r.wnext = 0, r.whave = 0, r.window = new Z.Buf8(r.wsize)), i >= r.wsize ? (Z.arraySet(r.window, e, a - r.wsize, r.wsize, 0), r.wnext = 0, r.whave = r.wsize) : (i < (n = r.wsize - r.wnext) && (n = i), Z.arraySet(r.window, e, a - i, n, r.wnext), (i -= n) ? (Z.arraySet(r.window, e, a - i, i, 0), r.wnext = i, r.whave = r.wsize) : (r.wnext += n, r.wnext === r.wsize && (r.wnext = 0), r.whave < r.wsize && (r.whave += n))), 0;
              }
              a.inflateReset = o, a.inflateReset2 = l, a.inflateResetKeep = s, a.inflateInit = function (t) {
                return h(t, 15);
              }, a.inflateInit2 = h, a.inflate = function (t, e) {
                var a,
                  i,
                  n,
                  r,
                  s,
                  o,
                  l,
                  h,
                  d,
                  f,
                  _,
                  u,
                  c,
                  b,
                  g,
                  m,
                  w,
                  p,
                  v,
                  k,
                  y,
                  x,
                  z,
                  B,
                  S = 0,
                  E = new Z.Buf8(4),
                  A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
                if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in) return T;
                12 === (a = t.state).mode && (a.mode = 13), s = t.next_out, n = t.output, l = t.avail_out, r = t.next_in, i = t.input, o = t.avail_in, h = a.hold, d = a.bits, f = o, _ = l, x = U;
                t: for (;;) switch (a.mode) {
                  case F:
                    if (0 === a.wrap) {
                      a.mode = 13;
                      break;
                    }
                    for (; d < 16;) {
                      if (0 === o) break t;
                      o--, h += i[r++] << d, d += 8;
                    }
                    if (2 & a.wrap && 35615 === h) {
                      E[a.check = 0] = 255 & h, E[1] = h >>> 8 & 255, a.check = C(a.check, E, 2, 0), d = h = 0, a.mode = 2;
                      break;
                    }
                    if (a.flags = 0, a.head && (a.head.done = !1), !(1 & a.wrap) || (((255 & h) << 8) + (h >> 8)) % 31) {
                      t.msg = 'incorrect header check', a.mode = 30;
                      break;
                    }
                    if (8 != (15 & h)) {
                      t.msg = 'unknown compression method', a.mode = 30;
                      break;
                    }
                    if (d -= 4, y = 8 + (15 & (h >>>= 4)), 0 === a.wbits) a.wbits = y;else if (y > a.wbits) {
                      t.msg = 'invalid window size', a.mode = 30;
                      break;
                    }
                    a.dmax = 1 << y, t.adler = a.check = 1, a.mode = 512 & h ? 10 : 12, d = h = 0;
                    break;
                  case 2:
                    for (; d < 16;) {
                      if (0 === o) break t;
                      o--, h += i[r++] << d, d += 8;
                    }
                    if (a.flags = h, 8 != (255 & a.flags)) {
                      t.msg = 'unknown compression method', a.mode = 30;
                      break;
                    }
                    if (57344 & a.flags) {
                      t.msg = 'unknown header flags set', a.mode = 30;
                      break;
                    }
                    a.head && (a.head.text = h >> 8 & 1), 512 & a.flags && (E[0] = 255 & h, E[1] = h >>> 8 & 255, a.check = C(a.check, E, 2, 0)), d = h = 0, a.mode = 3;
                  case 3:
                    for (; d < 32;) {
                      if (0 === o) break t;
                      o--, h += i[r++] << d, d += 8;
                    }
                    a.head && (a.head.time = h), 512 & a.flags && (E[0] = 255 & h, E[1] = h >>> 8 & 255, E[2] = h >>> 16 & 255, E[3] = h >>> 24 & 255, a.check = C(a.check, E, 4, 0)), d = h = 0, a.mode = 4;
                  case 4:
                    for (; d < 16;) {
                      if (0 === o) break t;
                      o--, h += i[r++] << d, d += 8;
                    }
                    a.head && (a.head.xflags = 255 & h, a.head.os = h >> 8), 512 & a.flags && (E[0] = 255 & h, E[1] = h >>> 8 & 255, a.check = C(a.check, E, 2, 0)), d = h = 0, a.mode = 5;
                  case 5:
                    if (1024 & a.flags) {
                      for (; d < 16;) {
                        if (0 === o) break t;
                        o--, h += i[r++] << d, d += 8;
                      }
                      a.length = h, a.head && (a.head.extra_len = h), 512 & a.flags && (E[0] = 255 & h, E[1] = h >>> 8 & 255, a.check = C(a.check, E, 2, 0)), d = h = 0;
                    } else a.head && (a.head.extra = null);
                    a.mode = 6;
                  case 6:
                    if (1024 & a.flags && (o < (u = a.length) && (u = o), u && (a.head && (y = a.head.extra_len - a.length, a.head.extra || (a.head.extra = new Array(a.head.extra_len)), Z.arraySet(a.head.extra, i, r, u, y)), 512 & a.flags && (a.check = C(a.check, i, u, r)), o -= u, r += u, a.length -= u), a.length)) break t;
                    a.length = 0, a.mode = 7;
                  case 7:
                    if (2048 & a.flags) {
                      if (0 === o) break t;
                      for (u = 0; y = i[r + u++], a.head && y && a.length < 65536 && (a.head.name += String.fromCharCode(y)), y && u < o;);
                      if (512 & a.flags && (a.check = C(a.check, i, u, r)), o -= u, r += u, y) break t;
                    } else a.head && (a.head.name = null);
                    a.length = 0, a.mode = 8;
                  case 8:
                    if (4096 & a.flags) {
                      if (0 === o) break t;
                      for (u = 0; y = i[r + u++], a.head && y && a.length < 65536 && (a.head.comment += String.fromCharCode(y)), y && u < o;);
                      if (512 & a.flags && (a.check = C(a.check, i, u, r)), o -= u, r += u, y) break t;
                    } else a.head && (a.head.comment = null);
                    a.mode = 9;
                  case 9:
                    if (512 & a.flags) {
                      for (; d < 16;) {
                        if (0 === o) break t;
                        o--, h += i[r++] << d, d += 8;
                      }
                      if (h !== (65535 & a.check)) {
                        t.msg = 'header crc mismatch', a.mode = 30;
                        break;
                      }
                      d = h = 0;
                    }
                    a.head && (a.head.hcrc = a.flags >> 9 & 1, a.head.done = !0), t.adler = a.check = 0, a.mode = 12;
                    break;
                  case 10:
                    for (; d < 32;) {
                      if (0 === o) break t;
                      o--, h += i[r++] << d, d += 8;
                    }
                    t.adler = a.check = L(h), d = h = 0, a.mode = 11;
                  case 11:
                    if (0 === a.havedict) return t.next_out = s, t.avail_out = l, t.next_in = r, t.avail_in = o, a.hold = h, a.bits = d, 2;
                    t.adler = a.check = 1, a.mode = 12;
                  case 12:
                    if (5 === e || 6 === e) break t;
                  case 13:
                    if (a.last) {
                      h >>>= 7 & d, d -= 7 & d, a.mode = 27;
                      break;
                    }
                    for (; d < 3;) {
                      if (0 === o) break t;
                      o--, h += i[r++] << d, d += 8;
                    }
                    switch (a.last = 1 & h, d -= 1, 3 & (h >>>= 1)) {
                      case 0:
                        a.mode = 14;
                        break;
                      case 1:
                        if (H(a), a.mode = 20, 6 !== e) break;
                        h >>>= 2, d -= 2;
                        break t;
                      case 2:
                        a.mode = 17;
                        break;
                      case 3:
                        t.msg = 'invalid block type', a.mode = 30;
                    }
                    h >>>= 2, d -= 2;
                    break;
                  case 14:
                    for (h >>>= 7 & d, d -= 7 & d; d < 32;) {
                      if (0 === o) break t;
                      o--, h += i[r++] << d, d += 8;
                    }
                    if ((65535 & h) != (h >>> 16 ^ 65535)) {
                      t.msg = 'invalid stored block lengths', a.mode = 30;
                      break;
                    }
                    if (a.length = 65535 & h, d = h = 0, a.mode = 15, 6 === e) break t;
                  case 15:
                    a.mode = 16;
                  case 16:
                    if (u = a.length) {
                      if (o < u && (u = o), l < u && (u = l), 0 === u) break t;
                      Z.arraySet(n, i, r, u, s), o -= u, r += u, l -= u, s += u, a.length -= u;
                      break;
                    }
                    a.mode = 12;
                    break;
                  case 17:
                    for (; d < 14;) {
                      if (0 === o) break t;
                      o--, h += i[r++] << d, d += 8;
                    }
                    if (a.nlen = 257 + (31 & h), h >>>= 5, d -= 5, a.ndist = 1 + (31 & h), h >>>= 5, d -= 5, a.ncode = 4 + (15 & h), h >>>= 4, d -= 4, 286 < a.nlen || 30 < a.ndist) {
                      t.msg = 'too many length or distance symbols', a.mode = 30;
                      break;
                    }
                    a.have = 0, a.mode = 18;
                  case 18:
                    for (; a.have < a.ncode;) {
                      for (; d < 3;) {
                        if (0 === o) break t;
                        o--, h += i[r++] << d, d += 8;
                      }
                      a.lens[A[a.have++]] = 7 & h, h >>>= 3, d -= 3;
                    }
                    for (; a.have < 19;) a.lens[A[a.have++]] = 0;
                    if (a.lencode = a.lendyn, a.lenbits = 7, z = {
                      bits: a.lenbits
                    }, x = O(0, a.lens, 0, 19, a.lencode, 0, a.work, z), a.lenbits = z.bits, x) {
                      t.msg = 'invalid code lengths set', a.mode = 30;
                      break;
                    }
                    a.have = 0, a.mode = 19;
                  case 19:
                    for (; a.have < a.nlen + a.ndist;) {
                      for (; m = (S = a.lencode[h & (1 << a.lenbits) - 1]) >>> 16 & 255, w = 65535 & S, !((g = S >>> 24) <= d);) {
                        if (0 === o) break t;
                        o--, h += i[r++] << d, d += 8;
                      }
                      if (w < 16) h >>>= g, d -= g, a.lens[a.have++] = w;else {
                        if (16 === w) {
                          for (B = g + 2; d < B;) {
                            if (0 === o) break t;
                            o--, h += i[r++] << d, d += 8;
                          }
                          if (h >>>= g, d -= g, 0 === a.have) {
                            t.msg = 'invalid bit length repeat', a.mode = 30;
                            break;
                          }
                          y = a.lens[a.have - 1], u = 3 + (3 & h), h >>>= 2, d -= 2;
                        } else if (17 === w) {
                          for (B = g + 3; d < B;) {
                            if (0 === o) break t;
                            o--, h += i[r++] << d, d += 8;
                          }
                          d -= g, y = 0, u = 3 + (7 & (h >>>= g)), h >>>= 3, d -= 3;
                        } else {
                          for (B = g + 7; d < B;) {
                            if (0 === o) break t;
                            o--, h += i[r++] << d, d += 8;
                          }
                          d -= g, y = 0, u = 11 + (127 & (h >>>= g)), h >>>= 7, d -= 7;
                        }
                        if (a.have + u > a.nlen + a.ndist) {
                          t.msg = 'invalid bit length repeat', a.mode = 30;
                          break;
                        }
                        for (; u--;) a.lens[a.have++] = y;
                      }
                    }
                    if (30 === a.mode) break;
                    if (0 === a.lens[256]) {
                      t.msg = 'invalid code -- missing end-of-block', a.mode = 30;
                      break;
                    }
                    if (a.lenbits = 9, z = {
                      bits: a.lenbits
                    }, x = O(D, a.lens, 0, a.nlen, a.lencode, 0, a.work, z), a.lenbits = z.bits, x) {
                      t.msg = 'invalid literal/lengths set', a.mode = 30;
                      break;
                    }
                    if (a.distbits = 6, a.distcode = a.distdyn, z = {
                      bits: a.distbits
                    }, x = O(I, a.lens, a.nlen, a.ndist, a.distcode, 0, a.work, z), a.distbits = z.bits, x) {
                      t.msg = 'invalid distances set', a.mode = 30;
                      break;
                    }
                    if (a.mode = 20, 6 === e) break t;
                  case 20:
                    a.mode = 21;
                  case 21:
                    if (6 <= o && 258 <= l) {
                      t.next_out = s, t.avail_out = l, t.next_in = r, t.avail_in = o, a.hold = h, a.bits = d, N(t, _), s = t.next_out, n = t.output, l = t.avail_out, r = t.next_in, i = t.input, o = t.avail_in, h = a.hold, d = a.bits, 12 === a.mode && (a.back = -1);
                      break;
                    }
                    for (a.back = 0; m = (S = a.lencode[h & (1 << a.lenbits) - 1]) >>> 16 & 255, w = 65535 & S, !((g = S >>> 24) <= d);) {
                      if (0 === o) break t;
                      o--, h += i[r++] << d, d += 8;
                    }
                    if (m && 0 == (240 & m)) {
                      for (p = g, v = m, k = w; m = (S = a.lencode[k + ((h & (1 << p + v) - 1) >> p)]) >>> 16 & 255, w = 65535 & S, !(p + (g = S >>> 24) <= d);) {
                        if (0 === o) break t;
                        o--, h += i[r++] << d, d += 8;
                      }
                      h >>>= p, d -= p, a.back += p;
                    }
                    if (h >>>= g, d -= g, a.back += g, a.length = w, 0 === m) {
                      a.mode = 26;
                      break;
                    }
                    if (32 & m) {
                      a.back = -1, a.mode = 12;
                      break;
                    }
                    if (64 & m) {
                      t.msg = 'invalid literal/length code', a.mode = 30;
                      break;
                    }
                    a.extra = 15 & m, a.mode = 22;
                  case 22:
                    if (a.extra) {
                      for (B = a.extra; d < B;) {
                        if (0 === o) break t;
                        o--, h += i[r++] << d, d += 8;
                      }
                      a.length += h & (1 << a.extra) - 1, h >>>= a.extra, d -= a.extra, a.back += a.extra;
                    }
                    a.was = a.length, a.mode = 23;
                  case 23:
                    for (; m = (S = a.distcode[h & (1 << a.distbits) - 1]) >>> 16 & 255, w = 65535 & S, !((g = S >>> 24) <= d);) {
                      if (0 === o) break t;
                      o--, h += i[r++] << d, d += 8;
                    }
                    if (0 == (240 & m)) {
                      for (p = g, v = m, k = w; m = (S = a.distcode[k + ((h & (1 << p + v) - 1) >> p)]) >>> 16 & 255, w = 65535 & S, !(p + (g = S >>> 24) <= d);) {
                        if (0 === o) break t;
                        o--, h += i[r++] << d, d += 8;
                      }
                      h >>>= p, d -= p, a.back += p;
                    }
                    if (h >>>= g, d -= g, a.back += g, 64 & m) {
                      t.msg = 'invalid distance code', a.mode = 30;
                      break;
                    }
                    a.offset = w, a.extra = 15 & m, a.mode = 24;
                  case 24:
                    if (a.extra) {
                      for (B = a.extra; d < B;) {
                        if (0 === o) break t;
                        o--, h += i[r++] << d, d += 8;
                      }
                      a.offset += h & (1 << a.extra) - 1, h >>>= a.extra, d -= a.extra, a.back += a.extra;
                    }
                    if (a.offset > a.dmax) {
                      t.msg = 'invalid distance too far back', a.mode = 30;
                      break;
                    }
                    a.mode = 25;
                  case 25:
                    if (0 === l) break t;
                    if (u = _ - l, a.offset > u) {
                      if ((u = a.offset - u) > a.whave && a.sane) {
                        t.msg = 'invalid distance too far back', a.mode = 30;
                        break;
                      }
                      u > a.wnext ? (u -= a.wnext, c = a.wsize - u) : c = a.wnext - u, u > a.length && (u = a.length), b = a.window;
                    } else b = n, c = s - a.offset, u = a.length;
                    for (l < u && (u = l), l -= u, a.length -= u; n[s++] = b[c++], --u;);
                    0 === a.length && (a.mode = 21);
                    break;
                  case 26:
                    if (0 === l) break t;
                    n[s++] = a.length, l--, a.mode = 21;
                    break;
                  case 27:
                    if (a.wrap) {
                      for (; d < 32;) {
                        if (0 === o) break t;
                        o--, h |= i[r++] << d, d += 8;
                      }
                      if (_ -= l, t.total_out += _, a.total += _, _ && (t.adler = a.check = a.flags ? C(a.check, n, _, s - _) : R(a.check, n, _, s - _)), _ = l, (a.flags ? h : L(h)) !== a.check) {
                        t.msg = 'incorrect data check', a.mode = 30;
                        break;
                      }
                      d = h = 0;
                    }
                    a.mode = 28;
                  case 28:
                    if (a.wrap && a.flags) {
                      for (; d < 32;) {
                        if (0 === o) break t;
                        o--, h += i[r++] << d, d += 8;
                      }
                      if (h !== (4294967295 & a.total)) {
                        t.msg = 'incorrect length check', a.mode = 30;
                        break;
                      }
                      d = h = 0;
                    }
                    a.mode = 29;
                  case 29:
                    x = 1;
                    break t;
                  case 30:
                    x = -3;
                    break t;
                  case 31:
                    return -4;
                  case 32:
                  default:
                    return T;
                }
                return t.next_out = s, t.avail_out = l, t.next_in = r, t.avail_in = o, a.hold = h, a.bits = d, (a.wsize || _ !== t.avail_out && a.mode < 30 && (a.mode < 27 || 4 !== e)) && j(t, t.output, t.next_out, _ - t.avail_out) ? (a.mode = 31, -4) : (f -= t.avail_in, _ -= t.avail_out, t.total_in += f, t.total_out += _, a.total += _, a.wrap && _ && (t.adler = a.check = a.flags ? C(a.check, n, _, t.next_out - _) : R(a.check, n, _, t.next_out - _)), t.data_type = a.bits + (a.last ? 64 : 0) + (12 === a.mode ? 128 : 0) + (20 === a.mode || 15 === a.mode ? 256 : 0), (0 === f && 0 === _ || 4 === e) && x === U && (x = -5), x);
              }, a.inflateEnd = function (t) {
                if (!t || !t.state) return T;
                var e = t.state;
                return e.window && (e.window = null), t.state = null, U;
              }, a.inflateGetHeader = function (t, e) {
                var a;
                return t && t.state ? 0 == (2 & (a = t.state).wrap) ? T : ((a.head = e).done = !1, U) : T;
              }, a.inflateSetDictionary = function (t, e) {
                var a,
                  i = e.length;
                return t && t.state ? 0 !== (a = t.state).wrap && 11 !== a.mode ? T : 11 === a.mode && R(1, e, i, 0) !== a.check ? -3 : j(t, e, i, i) ? (a.mode = 31, -4) : (a.havedict = 1, U) : T;
              }, a.inflateInfo = 'pako inflate (from Nodeca project)';
            }, {
              '../utils/common': 3,
              './adler32': 5,
              './crc32': 7,
              './inffast': 10,
              './inftrees': 12
            }],
            12: [function (t, e, a) {
              var D = t('../utils/common'),
                I = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
                U = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
                T = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
                F = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
              e.exports = function (t, e, a, i, n, r, s, o) {
                var l,
                  h,
                  d,
                  f,
                  _,
                  u,
                  c,
                  b,
                  g,
                  m = o.bits,
                  w = 0,
                  p = 0,
                  v = 0,
                  k = 0,
                  y = 0,
                  x = 0,
                  z = 0,
                  B = 0,
                  S = 0,
                  E = 0,
                  A = null,
                  Z = 0,
                  R = new D.Buf16(16),
                  C = new D.Buf16(16),
                  N = null,
                  O = 0;
                for (w = 0; w <= 15; w++) R[w] = 0;
                for (p = 0; p < i; p++) R[e[a + p]]++;
                for (y = m, k = 15; 1 <= k && 0 === R[k]; k--);
                if (k < y && (y = k), 0 === k) return n[r++] = 20971520, n[r++] = 20971520, o.bits = 1, 0;
                for (v = 1; v < k && 0 === R[v]; v++);
                for (y < v && (y = v), w = B = 1; w <= 15; w++) if (B <<= 1, (B -= R[w]) < 0) return -1;
                if (0 < B && (0 === t || 1 !== k)) return -1;
                for (C[1] = 0, w = 1; w < 15; w++) C[w + 1] = C[w] + R[w];
                for (p = 0; p < i; p++) 0 !== e[a + p] && (s[C[e[a + p]]++] = p);
                if (0 === t ? (A = N = s, u = 19) : 1 === t ? (A = I, Z -= 257, N = U, O -= 257, u = 256) : (A = T, N = F, u = -1), w = v, _ = r, z = p = E = 0, d = -1, f = (S = 1 << (x = y)) - 1, 1 === t && 852 < S || 2 === t && 592 < S) return 1;
                for (;;) {
                  for (c = w - z, s[p] < u ? (b = 0, g = s[p]) : s[p] > u ? (b = N[O + s[p]], g = A[Z + s[p]]) : (b = 96, g = 0), l = 1 << w - z, v = h = 1 << x; n[_ + (E >> z) + (h -= l)] = c << 24 | b << 16 | g | 0, 0 !== h;);
                  for (l = 1 << w - 1; E & l;) l >>= 1;
                  if (0 !== l ? (E &= l - 1, E += l) : E = 0, p++, 0 == --R[w]) {
                    if (w === k) break;
                    w = e[a + s[p]];
                  }
                  if (y < w && (E & f) !== d) {
                    for (0 === z && (z = y), _ += v, B = 1 << (x = w - z); x + z < k && !((B -= R[x + z]) <= 0);) x++, B <<= 1;
                    if (S += 1 << x, 1 === t && 852 < S || 2 === t && 592 < S) return 1;
                    n[d = E & f] = y << 24 | x << 16 | _ - r | 0;
                  }
                }
                return 0 !== E && (n[_ + E] = w - z << 24 | 64 << 16 | 0), o.bits = y, 0;
              };
            }, {
              '../utils/common': 3
            }],
            13: [function (t, e, a) {
              e.exports = {
                2: 'need dictionary',
                1: 'stream end',
                0: '',
                '-1': 'file error',
                '-2': 'stream error',
                '-3': 'data error',
                '-4': 'insufficient memory',
                '-5': 'buffer error',
                '-6': 'incompatible version'
              };
            }, {}],
            14: [function (t, e, a) {
              var l = t('../utils/common'),
                o = 0,
                h = 1;
              function i(t) {
                for (var e = t.length; 0 <= --e;) t[e] = 0;
              }
              var d = 0,
                s = 29,
                f = 256,
                _ = f + 1 + s,
                u = 30,
                c = 19,
                g = 2 * _ + 1,
                m = 15,
                n = 16,
                b = 7,
                w = 256,
                p = 16,
                v = 17,
                k = 18,
                y = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
                x = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
                z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
                B = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
                S = new Array(2 * (_ + 2));
              i(S);
              var E = new Array(2 * u);
              i(E);
              var A = new Array(512);
              i(A);
              var Z = new Array(256);
              i(Z);
              var R = new Array(s);
              i(R);
              var C,
                N,
                O,
                D = new Array(u);
              function I(t, e, a, i, n) {
                this.static_tree = t, this.extra_bits = e, this.extra_base = a, this.elems = i, this.max_length = n, this.has_stree = t && t.length;
              }
              function r(t, e) {
                this.dyn_tree = t, this.max_code = 0, this.stat_desc = e;
              }
              function U(t) {
                return t < 256 ? A[t] : A[256 + (t >>> 7)];
              }
              function T(t, e) {
                t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255;
              }
              function F(t, e, a) {
                t.bi_valid > n - a ? (t.bi_buf |= e << t.bi_valid & 65535, T(t, t.bi_buf), t.bi_buf = e >> n - t.bi_valid, t.bi_valid += a - n) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += a);
              }
              function L(t, e, a) {
                F(t, a[2 * e], a[2 * e + 1]);
              }
              function H(t, e) {
                for (var a = 0; a |= 1 & t, t >>>= 1, a <<= 1, 0 < --e;);
                return a >>> 1;
              }
              function j(t, e, a) {
                var i,
                  n,
                  r = new Array(m + 1),
                  s = 0;
                for (i = 1; i <= m; i++) r[i] = s = s + a[i - 1] << 1;
                for (n = 0; n <= e; n++) {
                  var o = t[2 * n + 1];
                  0 !== o && (t[2 * n] = H(r[o]++, o));
                }
              }
              function K(t) {
                var e;
                for (e = 0; e < _; e++) t.dyn_ltree[2 * e] = 0;
                for (e = 0; e < u; e++) t.dyn_dtree[2 * e] = 0;
                for (e = 0; e < c; e++) t.bl_tree[2 * e] = 0;
                t.dyn_ltree[2 * w] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0;
              }
              function M(t) {
                8 < t.bi_valid ? T(t, t.bi_buf) : 0 < t.bi_valid && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0;
              }
              function P(t, e, a, i) {
                var n = 2 * e,
                  r = 2 * a;
                return t[n] < t[r] || t[n] === t[r] && i[e] <= i[a];
              }
              function Y(t, e, a) {
                for (var i = t.heap[a], n = a << 1; n <= t.heap_len && (n < t.heap_len && P(e, t.heap[n + 1], t.heap[n], t.depth) && n++, !P(e, i, t.heap[n], t.depth));) t.heap[a] = t.heap[n], a = n, n <<= 1;
                t.heap[a] = i;
              }
              function q(t, e, a) {
                var i,
                  n,
                  r,
                  s,
                  o = 0;
                if (0 !== t.last_lit) for (; i = t.pending_buf[t.d_buf + 2 * o] << 8 | t.pending_buf[t.d_buf + 2 * o + 1], n = t.pending_buf[t.l_buf + o], o++, 0 === i ? L(t, n, e) : (L(t, (r = Z[n]) + f + 1, e), 0 !== (s = y[r]) && F(t, n -= R[r], s), L(t, r = U(--i), a), 0 !== (s = x[r]) && F(t, i -= D[r], s)), o < t.last_lit;);
                L(t, w, e);
              }
              function G(t, e) {
                var a,
                  i,
                  n,
                  r = e.dyn_tree,
                  s = e.stat_desc.static_tree,
                  o = e.stat_desc.has_stree,
                  l = e.stat_desc.elems,
                  h = -1;
                for (t.heap_len = 0, t.heap_max = g, a = 0; a < l; a++) 0 !== r[2 * a] ? (t.heap[++t.heap_len] = h = a, t.depth[a] = 0) : r[2 * a + 1] = 0;
                for (; t.heap_len < 2;) r[2 * (n = t.heap[++t.heap_len] = h < 2 ? ++h : 0)] = 1, t.depth[n] = 0, t.opt_len--, o && (t.static_len -= s[2 * n + 1]);
                for (e.max_code = h, a = t.heap_len >> 1; 1 <= a; a--) Y(t, r, a);
                for (n = l; a = t.heap[1], t.heap[1] = t.heap[t.heap_len--], Y(t, r, 1), i = t.heap[1], t.heap[--t.heap_max] = a, t.heap[--t.heap_max] = i, r[2 * n] = r[2 * a] + r[2 * i], t.depth[n] = (t.depth[a] >= t.depth[i] ? t.depth[a] : t.depth[i]) + 1, r[2 * a + 1] = r[2 * i + 1] = n, t.heap[1] = n++, Y(t, r, 1), 2 <= t.heap_len;);
                t.heap[--t.heap_max] = t.heap[1], function (t, e) {
                  var a,
                    i,
                    n,
                    r,
                    s,
                    o,
                    l = e.dyn_tree,
                    h = e.max_code,
                    d = e.stat_desc.static_tree,
                    f = e.stat_desc.has_stree,
                    _ = e.stat_desc.extra_bits,
                    u = e.stat_desc.extra_base,
                    c = e.stat_desc.max_length,
                    b = 0;
                  for (r = 0; r <= m; r++) t.bl_count[r] = 0;
                  for (l[2 * t.heap[t.heap_max] + 1] = 0, a = t.heap_max + 1; a < g; a++) c < (r = l[2 * l[2 * (i = t.heap[a]) + 1] + 1] + 1) && (r = c, b++), l[2 * i + 1] = r, h < i || (t.bl_count[r]++, s = 0, u <= i && (s = _[i - u]), o = l[2 * i], t.opt_len += o * (r + s), f && (t.static_len += o * (d[2 * i + 1] + s)));
                  if (0 !== b) {
                    do {
                      for (r = c - 1; 0 === t.bl_count[r];) r--;
                      t.bl_count[r]--, t.bl_count[r + 1] += 2, t.bl_count[c]--, b -= 2;
                    } while (0 < b);
                    for (r = c; 0 !== r; r--) for (i = t.bl_count[r]; 0 !== i;) h < (n = t.heap[--a]) || (l[2 * n + 1] !== r && (t.opt_len += (r - l[2 * n + 1]) * l[2 * n], l[2 * n + 1] = r), i--);
                  }
                }(t, e), j(r, h, t.bl_count);
              }
              function X(t, e, a) {
                var i,
                  n,
                  r = -1,
                  s = e[1],
                  o = 0,
                  l = 7,
                  h = 4;
                for (0 === s && (l = 138, h = 3), e[2 * (a + 1) + 1] = 65535, i = 0; i <= a; i++) n = s, s = e[2 * (i + 1) + 1], ++o < l && n === s || (o < h ? t.bl_tree[2 * n] += o : 0 !== n ? (n !== r && t.bl_tree[2 * n]++, t.bl_tree[2 * p]++) : o <= 10 ? t.bl_tree[2 * v]++ : t.bl_tree[2 * k]++, r = n, (o = 0) === s ? (l = 138, h = 3) : n === s ? (l = 6, h = 3) : (l = 7, h = 4));
              }
              function W(t, e, a) {
                var i,
                  n,
                  r = -1,
                  s = e[1],
                  o = 0,
                  l = 7,
                  h = 4;
                for (0 === s && (l = 138, h = 3), i = 0; i <= a; i++) if (n = s, s = e[2 * (i + 1) + 1], !(++o < l && n === s)) {
                  if (o < h) for (; L(t, n, t.bl_tree), 0 != --o;);else 0 !== n ? (n !== r && (L(t, n, t.bl_tree), o--), L(t, p, t.bl_tree), F(t, o - 3, 2)) : o <= 10 ? (L(t, v, t.bl_tree), F(t, o - 3, 3)) : (L(t, k, t.bl_tree), F(t, o - 11, 7));
                  r = n, (o = 0) === s ? (l = 138, h = 3) : n === s ? (l = 6, h = 3) : (l = 7, h = 4);
                }
              }
              i(D);
              var J = !1;
              function Q(t, e, a, i) {
                var n, r, s, o;
                F(t, (d << 1) + (i ? 1 : 0), 3), r = e, s = a, o = !0, M(n = t), o && (T(n, s), T(n, ~s)), l.arraySet(n.pending_buf, n.window, r, s, n.pending), n.pending += s;
              }
              a._tr_init = function (t) {
                J || (function () {
                  var t,
                    e,
                    a,
                    i,
                    n,
                    r = new Array(m + 1);
                  for (i = a = 0; i < s - 1; i++) for (R[i] = a, t = 0; t < 1 << y[i]; t++) Z[a++] = i;
                  for (Z[a - 1] = i, i = n = 0; i < 16; i++) for (D[i] = n, t = 0; t < 1 << x[i]; t++) A[n++] = i;
                  for (n >>= 7; i < u; i++) for (D[i] = n << 7, t = 0; t < 1 << x[i] - 7; t++) A[256 + n++] = i;
                  for (e = 0; e <= m; e++) r[e] = 0;
                  for (t = 0; t <= 143;) S[2 * t + 1] = 8, t++, r[8]++;
                  for (; t <= 255;) S[2 * t + 1] = 9, t++, r[9]++;
                  for (; t <= 279;) S[2 * t + 1] = 7, t++, r[7]++;
                  for (; t <= 287;) S[2 * t + 1] = 8, t++, r[8]++;
                  for (j(S, _ + 1, r), t = 0; t < u; t++) E[2 * t + 1] = 5, E[2 * t] = H(t, 5);
                  C = new I(S, y, f + 1, _, m), N = new I(E, x, 0, u, m), O = new I(new Array(0), z, 0, c, b);
                }(), J = !0), t.l_desc = new r(t.dyn_ltree, C), t.d_desc = new r(t.dyn_dtree, N), t.bl_desc = new r(t.bl_tree, O), t.bi_buf = 0, t.bi_valid = 0, K(t);
              }, a._tr_stored_block = Q, a._tr_flush_block = function (t, e, a, i) {
                var n,
                  r,
                  s = 0;
                0 < t.level ? (2 === t.strm.data_type && (t.strm.data_type = function (t) {
                  var e,
                    a = 4093624447;
                  for (e = 0; e <= 31; e++, a >>>= 1) if (1 & a && 0 !== t.dyn_ltree[2 * e]) return o;
                  if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return h;
                  for (e = 32; e < f; e++) if (0 !== t.dyn_ltree[2 * e]) return h;
                  return o;
                }(t)), G(t, t.l_desc), G(t, t.d_desc), s = function (t) {
                  var e;
                  for (X(t, t.dyn_ltree, t.l_desc.max_code), X(t, t.dyn_dtree, t.d_desc.max_code), G(t, t.bl_desc), e = c - 1; 3 <= e && 0 === t.bl_tree[2 * B[e] + 1]; e--);
                  return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e;
                }(t), n = t.opt_len + 3 + 7 >>> 3, (r = t.static_len + 3 + 7 >>> 3) <= n && (n = r)) : n = r = a + 5, a + 4 <= n && -1 !== e ? Q(t, e, a, i) : 4 === t.strategy || r === n ? (F(t, 2 + (i ? 1 : 0), 3), q(t, S, E)) : (F(t, 4 + (i ? 1 : 0), 3), function (t, e, a, i) {
                  var n;
                  for (F(t, e - 257, 5), F(t, a - 1, 5), F(t, i - 4, 4), n = 0; n < i; n++) F(t, t.bl_tree[2 * B[n] + 1], 3);
                  W(t, t.dyn_ltree, e - 1), W(t, t.dyn_dtree, a - 1);
                }(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, s + 1), q(t, t.dyn_ltree, t.dyn_dtree)), K(t), i && M(t);
              }, a._tr_tally = function (t, e, a) {
                return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e, t.pending_buf[t.l_buf + t.last_lit] = 255 & a, t.last_lit++, 0 === e ? t.dyn_ltree[2 * a]++ : (t.matches++, e--, t.dyn_ltree[2 * (Z[a] + f + 1)]++, t.dyn_dtree[2 * U(e)]++), t.last_lit === t.lit_bufsize - 1;
              }, a._tr_align = function (t) {
                var e;
                F(t, 2, 3), L(t, w, S), 16 === (e = t).bi_valid ? (T(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : 8 <= e.bi_valid && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8);
              };
            }, {
              '../utils/common': 3
            }],
            15: [function (t, e, a) {
              e.exports = function () {
                this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = '', this.state = null, this.data_type = 2, this.adler = 0;
              };
            }, {}],
            '/': [function (t, e, a) {
              var i = {};
              (0, t('./lib/utils/common').assign)(i, t('./lib/deflate'), t('./lib/inflate'), t('./lib/zlib/constants')), e.exports = i;
            }, {
              './lib/deflate': 1,
              './lib/inflate': 2,
              './lib/utils/common': 3,
              './lib/zlib/constants': 6
            }]
          }, {}, [])('/');
        });

        // #endregion ORIGINAL CODE

        _cjsExports = exports('default', module.exports);
      }, {});
    }
  };
});

System.register("chunks:///_virtual/pako.min.mjs_cjs=&original=.js", ['./pako.min.js', './cjs-loader.mjs'], function (exports, module) {
  var __cjsMetaURL, loader;
  return {
    setters: [function (module) {
      __cjsMetaURL = module.__cjsMetaURL;
      var _setter = {};
      _setter.__cjsMetaURL = module.__cjsMetaURL;
      _setter.default = module.default;
      exports(_setter);
    }, function (module) {
      loader = module.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './pako.min.js'~
      if (!__cjsMetaURL) {
        loader.throwInvalidWrapper('./pako.min.js', module.meta.url);
      }
      loader.require(__cjsMetaURL);
    }
  };
});

System.register("chunks:///_virtual/PhysicsUtil.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c1584nuvI9HtJ5IHcmFEBzR", "PhysicsUtil", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-07-21 17:30:59
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-02 14:40:28
       */
      /** 物理分组数据 */
      class GroupItem {
        /** 分组值 */
        get value() {
          return this._value;
        }
        /** 分组名 */
        get name() {
          return this._name;
        }

        /** 碰撞掩码 */
        get mask() {
          return 1 << this._value;
        }

        /**
         * 构造函数
         * @param value 分组值
         * @param name  分组名
         */
        constructor(value, name) {
          this._value = void 0;
          this._name = void 0;
          this._value = value;
          this._name = name;
        }
      }
      exports('GroupItem', GroupItem);

      /***
       * 为了方便使用，将编辑器中的物理分组定义到代码。如果编辑器中有修改，确保同步到这里。
       */
      class PhysicsUtil {
        static setNodeLayer(item, node) {
          node.layer = item.mask;
          node.children.forEach(n => {
            n.layer = item.mask;
            PhysicsUtil.setNodeLayer(item, n);
          });
        }
      }
      exports('PhysicsUtil', PhysicsUtil);
      /** 默认物理分组 */
      PhysicsUtil.DEFAULT = new GroupItem(0, 'DEFAULT');
      /** 能通过屏幕触摸中发出的射线检查到的游戏对象 */
      PhysicsUtil.GAME_OBJECT_SELECT = new GroupItem(1, 'GAME_OBJECT_SELECT');
      /** 玩家自己 */
      PhysicsUtil.GAME_OWNER = new GroupItem(2, 'GAME_OWNER');
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PlatformUtil.ts", ['cc'], function (exports) {
  var cclegacy, native, sys;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      native = module.native;
      sys = module.sys;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c08229jnmdPP5vR721N6GG9", "PlatformUtil", undefined);

      /** 平台数据 */
      class PlatformUtil {
        /** 是否为安卓系统 */
        static isNativeAndroid() {
          if (typeof native == "undefined") return false;
          if (sys.isNative && sys.platform === sys.Platform.ANDROID) return true;
          return false;
        }

        /** 是否为苹果系统 */
        static isNativeIOS() {
          if (typeof native == "undefined") return false;
          if (sys.isNative && sys.os === sys.OS.IOS) return true;
          return false;
        }

        /** 获取平台名 */
        static getPlateform() {
          if (this.isNativeAndroid()) return 'android';else if (this.isNativeIOS()) return 'ios';else return 'h5';
        }

        // static isIOSWebview() {
        //     //@ts-ignore
        //     if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.sdkLoginOut)
        //         return true
        //     else
        //         return false
        // }
      }
      exports('PlatformUtil', PlatformUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Pop.ts", ['cc', './Oops.ts'], function (exports) {
  var cclegacy, Component, _decorator, oops;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "4e60feX38BG5qbBLbJcqQTX", "Pop", undefined);
      const {
        ccclass,
        property
      } = _decorator;
      let Pop = exports('Pop', (_dec = ccclass('Pop'), _dec(_class = class Pop extends Component {
        onAdded(args) {
          console.log(args);
        }
        start() {}
        update(deltaTime) {}
        onClose() {
          oops.gui.removeByNode(this.node);
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Priority.ts", ['cc', './BranchNode.ts'], function (exports) {
  var cclegacy, BranchNode;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BranchNode = module.BranchNode;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f7555DSpj9LbYpRDi8/UKdN", "Priority", undefined);

      /** 优先 */
      class Priority extends BranchNode {
        success() {
          super.success();
          this._control.success();
        }
        fail() {
          super.fail();
          this._actualTask += 1;
          if (this._actualTask < this.children.length) {
            this._run(this._blackboard);
          } else {
            this._control.fail();
          }
        }
      }
      exports('Priority', Priority);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RandomManager.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "3e09eJBwfZBsLPqFszZLvMS", "RandomManager", undefined);
      /** 引擎 utils.ts 中有一些基础数学方法 */

      /** 随机管理 */
      class RandomManager {
        constructor() {
          /** 是否运行在客户端环境 */
          this.isClient = true;
          /** 是否为全局伪随机 */
          this.isGlobal = false;
          this.random = null;
        }
        /** 随机数管理单例对象 */
        static get instance() {
          if (this._instance == null) {
            this._instance = new RandomManager();
            this._instance.random = Math.random;
          }
          return this._instance;
        }
        getRandom() {
          return this.isGlobal ? Math.random() : this.random();
        }

        /** 设置随机种子 */
        setSeed(seed) {
          if (this.isClient) {
            //注：seedrandom.min.js文件在Cocos Creator中导入为插件生效
            //@ts-ignore
            if (Math.seedrandom) {
              if (this.isGlobal)
                //@ts-ignore
                new Math.seedrandom(seed, {
                  global: true
                });else
                //@ts-ignore
                this.random = new Math.seedrandom(seed);
            }
          } else {
            var seedrandom = require('seedrandom');
            if (this.isGlobal) new seedrandom(seed, {
              global: true
            });else this.random = new seedrandom(seed);
          }
        }

        /**
         * 生成指定范围的随机浮点数
         * @param min   最小值
         * @param max   最大值
         * @param type  类型
         */
        getRandomFloat(min = 0, max = 1) {
          return this.getRandom() * (max - min) + min;
        }

        /**
         * 生成指定范围的随机整数
         * @param min   最小值
         * @param max   最大值
         * @param type  类型
         * @example
        var min = 1;
        var max = 10;
        // [min,max) 得到一个两数之间的随机整数,这个值不小于min（如果min不是整数的话，得到一个向上取整的 min），并且小于（但不等于）max  
        RandomManager.instance.getRandomInt(min, max, 1);
          // [min,max] 得到一个两数之间的随机整数，包括两个数在内,这个值比min大（如果min不是整数，那就不小于比min大的整数），但小于（但不等于）max
        RandomManager.instance.getRandomInt(min, max, 2);
          // (min,max) 得到一个两数之间的随机整数
        RandomManager.instance.getRandomInt(min, max, 3);
         */
        getRandomInt(min, max, type = 2) {
          min = Math.ceil(min);
          max = Math.floor(max);
          switch (type) {
            case 1:
              // [min,max) 得到一个两数之间的随机整数,这个值不小于min（如果min不是整数的话，得到一个向上取整的 min），并且小于（但不等于）max  
              return Math.floor(this.getRandom() * (max - min)) + min;
            case 2:
              // [min,max] 得到一个两数之间的随机整数，包括两个数在内,这个值比min大（如果min不是整数，那就不小于比min大的整数），但小于（但不等于）max
              return Math.floor(this.getRandom() * (max - min + 1)) + min;
            case 3:
              // (min,max) 得到一个两数之间的随机整数
              return Math.floor(this.getRandom() * (max - min - 1)) + min + 1;
          }
          return 0;
        }

        /**
         * 根据最大值，最小值范围生成随机数数组
         * @param min   最小值
         * @param max   最大值
         * @param n     随机个数
         * @param type  类型
         * @example
        var a = RandomManager.instance.getRandomByMinMaxList(50, 100, 5)
        console.log("随机的数字", a);
         */
        getRandomByMinMaxList(min, max, n) {
          var result = [];
          for (let i = 0; i < n; i++) {
            result.push(this.getRandomInt(min, max));
          }
          return result;
        }

        /**
         * 获取数组中随机对象
         * @param objects 对象数组
         * @param n 随机个数
         * @example
        var b = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var r = RandomManager.instance.getRandomByObjectList(b, 5);
        console.log("原始的对象", b);
        console.log("随机的对象", r);
         */
        getRandomByObjectList(objects, n) {
          var temp = objects.slice();
          var result = [];
          for (let i = 0; i < n; i++) {
            let index = this.getRandomInt(0, objects.length, n);
            result.push(temp.splice(index, 1)[0]);
          }
          return result;
        }

        /**
         * 定和随机分配
         * @param n     随机数量
         * @param sum   随机元素合
         * @example
        var c = RandomManager.instance.getRandomBySumList(5, -100);
        console.log("定和随机分配", c);
         */
        getRandomBySumList(n, sum) {
          var residue = sum;
          var value = 0;
          var result = [];
          for (let i = 0; i < n; i++) {
            value = this.getRandomInt(0, residue, 3);
            if (i == n - 1) {
              value = residue;
            } else {
              residue -= value;
            }
            result.push(value);
          }
          return result;
        }
      }
      exports('RandomManager', RandomManager);
      RandomManager._instance = void 0;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RegexUtil.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "dec9bVPigFCmKy5NVk+0y7h", "RegexUtil", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-07-26 15:29:57
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-02 12:08:25
       */

      /** 正则工具 */
      class RegexUtil {
        /**
         * 判断字符是否为双字节字符（如中文字符）
         * @param string 原字符串
         */
        static isDoubleWord(string) {
          return /[^\x00-\xff]/.test(string);
        }
      }
      exports('RegexUtil', RegexUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ResLoader.ts", ['cc'], function (exports) {
  var cclegacy, assetManager, error, Asset, js, resources;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      assetManager = module.assetManager;
      error = module.error;
      Asset = module.Asset;
      js = module.js;
      resources = module.resources;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1a2e4jFffpHrYjrpxbnC760", "ResLoader", undefined);

      // (error: Error | null, asset: T) => void;  (error: Error | null, asset: T[], urls: string[]) => void;

      /** 
       * 游戏资管理 
       * 1、加载默认resources文件夹中资源
       * 2、加载默认bundle远程资源
       * 3、主动传递bundle名时，优先加载传递bundle名资源包中的资源
       */
      class ResLoader {
        constructor() {
          /** 全局默认加载的资源包名 */
          this.defaultBundleName = "resources";
        }
        /**
         * 加载远程资源
         * @param url           资源地址
         * @param options       资源参数，例：{ ext: ".png" }
         * @param onComplete    加载完成回调
         * @example
        var opt: IRemoteOptions = { ext: ".png" };
        var onComplete = (err: Error | null, data: ImageAsset) => {
        const texture = new Texture2D();
        texture.image = data;
        
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        
        var sprite = this.sprite.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;
        }
        oops.res.loadRemote<ImageAsset>(this.url, opt, onComplete);
         */
        loadRemote(url, ...args) {
          var options = null;
          var onComplete = null;
          if (args.length == 2) {
            options = args[0];
            onComplete = args[1];
          } else {
            onComplete = args[0];
          }
          assetManager.loadRemote(url, options, onComplete);
        }

        /**
         * 加载资源包
         * @param url       资源地址
         * @param complete  完成事件
         * @param v         资源MD5版本号
         * @example
        var serverUrl = "http://192.168.1.8:8080/";         // 服务器地址
        var md5 = "8e5c0";                                  // Cocos Creator 构建后的MD5字符
        await oops.res.loadBundle(serverUrl,md5);
         */
        loadBundle(url, v) {
          return new Promise((resolve, reject) => {
            assetManager.loadBundle(url, {
              version: v
            }, (err, bundle) => {
              if (err) {
                return error(err);
              }
              resolve(bundle);
            });
          });
        }

        /**
         * 加载一个资源
         * @param bundleName    远程包名
         * @param paths         资源路径
         * @param type          资源类型
         * @param onProgress    加载进度回调
         * @param onComplete    加载完成回调
         * @example
        oops.res.load("spine_path", sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
        });
         */

        load(bundleName, paths, type, onProgress, onComplete) {
          let args = null;
          if (typeof paths === "string" || paths instanceof Array) {
            args = this.parseLoadResArgs(paths, type, onProgress, onComplete);
            args.bundle = bundleName;
          } else {
            args = this.parseLoadResArgs(bundleName, paths, type, onProgress);
            args.bundle = this.defaultBundleName;
          }
          this.loadByArgs(args);
        }
        loadAsync(bundleName, paths, type) {
          return new Promise((resolve, reject) => {
            this.load(bundleName, paths, type, (err, asset) => {
              if (err) {
                error(err.message);
              }
              resolve(asset);
            });
          });
        }

        /**
         * 加载文件夹中的资源
         * @param bundleName    远程包名
         * @param dir           文件夹名
         * @param type          资源类型
         * @param onProgress    加载进度回调
         * @param onComplete    加载完成回调
         * @example
        // 加载进度事件
        var onProgressCallback = (finished: number, total: number, item: any) => {
        console.log("资源加载进度", finished, total);
        }
        // 加载完成事件
        var onCompleteCallback = () => {
        console.log("资源加载完成");
        }
        oops.res.loadDir("game", onProgressCallback, onCompleteCallback);
         */

        loadDir(bundleName, dir, type, onProgress, onComplete) {
          let args = null;
          if (typeof dir === "string") {
            args = this.parseLoadResArgs(dir, type, onProgress, onComplete);
            args.bundle = bundleName;
          } else {
            args = this.parseLoadResArgs(bundleName, dir, type, onProgress);
            args.bundle = this.defaultBundleName;
          }
          args.dir = args.paths;
          this.loadByArgs(args);
        }

        /**
         * 通过资源相对路径释放资源
         * @param path          资源路径
         * @param bundleName    远程资源包名
         */
        release(path, bundleName) {
          if (bundleName == null) bundleName = this.defaultBundleName;
          var bundle = assetManager.getBundle(bundleName);
          if (bundle) {
            var asset = bundle.get(path);
            if (asset) {
              this.releasePrefabtDepsRecursively(asset);
            }
          }
        }

        /**
         * 通过相对文件夹路径删除所有文件夹中资源
         * @param path          资源文件夹路径
         * @param bundleName    远程资源包名
         */
        releaseDir(path, bundleName) {
          if (bundleName == null) bundleName = this.defaultBundleName;
          var bundle = assetManager.getBundle(bundleName);
          if (bundle) {
            var infos = bundle.getDirWithPath(path);
            if (infos) {
              infos.map(info => {
                this.releasePrefabtDepsRecursively(info.uuid);
              });
            }
            if (path == "" && bundleName != "resources") {
              assetManager.removeBundle(bundle);
            }
          }
        }

        /** 释放预制依赖资源 */
        releasePrefabtDepsRecursively(uuid) {
          if (uuid instanceof Asset) {
            uuid.decRef();
            // assetManager.releaseAsset(uuid);
          } else {
            var asset = assetManager.assets.get(uuid);
            if (asset) {
              asset.decRef();
              // assetManager.releaseAsset(asset);
            }
          }

          // Cocos引擎内部已处理子关联资源的释放
          // if (asset instanceof Prefab) {
          //     var uuids: string[] = assetManager.dependUtil.getDepsRecursively(uuid)!;
          //     uuids.forEach(uuid => {
          //         var asset = assetManager.assets.get(uuid)!;
          //         asset.decRef();
          //     });
          // }
        }

        /**
         * 获取资源
         * @param path          资源路径
         * @param type          资源类型
         * @param bundleName    远程资源包名
         */
        get(path, type, bundleName) {
          if (bundleName == null) bundleName = this.defaultBundleName;
          var bundle = assetManager.getBundle(bundleName);
          return bundle.get(path, type);
        }

        /** 打印缓存中所有资源信息 */
        dump() {
          assetManager.assets.forEach((value, key) => {
            console.log(assetManager.assets.get(key));
          });
          console.log(`当前资源总数:${assetManager.assets.count}`);
        }
        parseLoadResArgs(paths, type, onProgress, onComplete) {
          let pathsOut = paths;
          let typeOut = type;
          let onProgressOut = onProgress;
          let onCompleteOut = onComplete;
          if (onComplete === undefined) {
            const isValidType = js.isChildClassOf(type, Asset);
            if (onProgress) {
              onCompleteOut = onProgress;
              if (isValidType) {
                onProgressOut = null;
              }
            } else if (onProgress === undefined && !isValidType) {
              onCompleteOut = type;
              onProgressOut = null;
              typeOut = null;
            }
            if (onProgress !== undefined && !isValidType) {
              onProgressOut = type;
              typeOut = null;
            }
          }
          return {
            paths: pathsOut,
            type: typeOut,
            onProgress: onProgressOut,
            onComplete: onCompleteOut
          };
        }
        loadByBundleAndArgs(bundle, args) {
          if (args.dir) {
            bundle.loadDir(args.paths, args.type, args.onProgress, args.onComplete);
          } else {
            if (typeof args.paths == 'string') {
              bundle.load(args.paths, args.type, args.onProgress, args.onComplete);
            } else {
              bundle.load(args.paths, args.type, args.onProgress, args.onComplete);
            }
          }
        }
        loadByArgs(args) {
          if (args.bundle) {
            if (assetManager.bundles.has(args.bundle)) {
              let bundle = assetManager.bundles.get(args.bundle);
              this.loadByBundleAndArgs(bundle, args);
            } else {
              // 自动加载bundle
              assetManager.loadBundle(args.bundle, (err, bundle) => {
                if (!err) {
                  this.loadByBundleAndArgs(bundle, args);
                }
              });
            }
          } else {
            this.loadByBundleAndArgs(resources, args);
          }
        }
      }
      exports('ResLoader', ResLoader);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Role.ts", ['cc', './ViewUtil.ts', './ECS.ts', './MoveTo2.ts', './RoleChangeJob.ts', './RoleUpgrade.ts', './RoleEnum.ts', './RoleModelBaseComp.ts', './RoleModelComp.ts', './RoleModelJobComp.ts', './RoleModelLevelComp.ts', './RoleViewComp.ts'], function (exports) {
  var cclegacy, Vec3, ViewUtil, ecs, MoveToComp, RoleChangeJobComp, RoleUpgradeComp, RoleAnimatorType, RoleModelBaseComp, RoleModelComp, RoleModelJobComp, RoleModelLevelComp, RoleViewComp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
    }, function (module) {
      ViewUtil = module.ViewUtil;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      MoveToComp = module.MoveToComp;
    }, function (module) {
      RoleChangeJobComp = module.RoleChangeJobComp;
    }, function (module) {
      RoleUpgradeComp = module.RoleUpgradeComp;
    }, function (module) {
      RoleAnimatorType = module.RoleAnimatorType;
    }, function (module) {
      RoleModelBaseComp = module.RoleModelBaseComp;
    }, function (module) {
      RoleModelComp = module.RoleModelComp;
    }, function (module) {
      RoleModelJobComp = module.RoleModelJobComp;
    }, function (module) {
      RoleModelLevelComp = module.RoleModelLevelComp;
    }, function (module) {
      RoleViewComp = module.RoleViewComp;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "deb5akLVylKA59zKO2WIC+K", "Role", undefined);
      /** 
       * 角色实体 
       * 需求
       * 1、角色基础属性的数据结构（唯一标识、名字、等级、经验、角色属性等）
       * 2、角色基础属性信息（力量、敏捷、生命等）
       * 3、角色职业信息（职业名、职业属性附加属性）
       * 4、角色需要有一个动画模型
       * 5、与玩家互动的玩法（升级、转职、攻击等）
       */
      let Role = exports('Role', (_dec = ecs.register('Role'), _dec(_class = class Role extends ecs.Entity {
        constructor(...args) {
          super(...args);
          // 数据层
          this.RoleModel = void 0;
          this.RoleModelBase = void 0;
          // 角色初始资质
          this.RoleModelJob = void 0;
          this.RoleModelLevel = void 0;
          // 业务层
          this.RoleChangeJob = void 0;
          // 转职
          this.RoleUpgrade = void 0;
          // 升级
          this.RoleMoveTo = void 0;
          // 移动
          // 视图层
          this.RoleView = void 0;
          // 动画
          this.RoleViewInfo = void 0;
        }
        // 属性界面

        init() {
          // 初始化实体常住 ECS 组件，定义实体特性
          this.addComponents(RoleModelComp, RoleModelBaseComp, RoleModelJobComp, RoleModelLevelComp);
        }

        /** 转职（ECS System处理逻辑，分享功能独立的业务代码） */
        changeJob(jobId) {
          var rcj = this.add(RoleChangeJobComp);
          rcj.jobId = jobId;
        }

        /** 角色升级（升级只修改数据，通过MVVM级件自动绑定等级变化后的界面角色生命属性刷新） */
        upgrade(lv = 0) {
          var ru = this.add(RoleUpgradeComp);
          ru.lv = lv;
        }

        /** 移动（ECS System处理逻辑，分享功能独立的业务代码）  */
        move(target) {
          var move = this.get(MoveToComp) || this.add(MoveToComp);
          move.target = target;
          move.node = this.RoleView.node;
          move.speed = 100;
        }
        destroy() {
          // 如果该组件对象是由ecs系统外部创建的，则不可回收，需要用户自己手动进行回收。
          this.remove(RoleViewComp);
          super.destroy();
        }

        /** 加载角色显示对象（cc.Component在创建后，添加到ECS框架中，使实体上任何一个ECS组件都可以通过 ECS API 获取到视图层对象 */
        load(parent, pos = Vec3.ZERO) {
          var node = ViewUtil.createPrefabNode("game/battle/role");
          var mv = node.getComponent(RoleViewComp);
          this.add(mv);
          node.parent = parent;
          node.setPosition(pos);
        }

        /** 攻击（DEMO没有战斗逻辑，所以只播放一个动画） */
        attack() {
          this.RoleView.animator.setTrigger(RoleAnimatorType.Attack);
        }
      }) || _class));

      // export class EcsRoleSystem extends ecs.System {
      //     constructor() {
      //         super();

      //         this.add(new RoleChangeJobSystem());
      //         this.add(new RoleUpgradeSystem());
      //     }
      // }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleChangeJob.ts", ['cc', './Oops.ts', './ECS.ts', './RoleModelJobComp.ts', './RoleEvent.ts'], function (exports) {
  var cclegacy, oops, ecs, RoleModelJobComp, RoleEvent;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      RoleModelJobComp = module.RoleModelJobComp;
    }, function (module) {
      RoleEvent = module.RoleEvent;
    }],
    execute: function () {
      var _dec, _class, _dec2, _class3;
      cclegacy._RF.push({}, "7ab8aezTB1GUIE0zFSbG9gU", "RoleChangeJob", undefined);

      /**
       * 角色转职
       * 
       * 实现功能
       * 1、修改角色职业子模块的职业数据
       * 2、自动通过战斗属性框架更新角色战斗属性多模块的叠加值
       * 3、切换角色动画的职业武器
       * 
       * 技术分析
       * 1、使用ecs.Comp做为业务输入参数的接口，可理解为一个对象成员方法接收了方法参数，通过ecs框架的特点，ecs.System 系统会监控自己关注的数据组件变化后，做对应的业务处理
       * 2、在角色实体上添加职业切换组件时触发业务逻辑的处理，完成后从角色实体上移除业务组件完成业务的生命周期。
       */
      let RoleChangeJobComp = exports('RoleChangeJobComp', (_dec = ecs.register('RoleChangeJob'), _dec(_class = class RoleChangeJobComp extends ecs.Comp {
        constructor(...args) {
          super(...args);
          /** 职业编号 */
          this.jobId = -1;
        }
        reset() {
          this.jobId = -1;
        }
      }) || _class));
      let RoleChangeJobSystem = exports('RoleChangeJobSystem', (_dec2 = ecs.register('Role'), _dec2(_class3 = class RoleChangeJobSystem extends ecs.ComblockSystem {
        filter() {
          return ecs.allOf(RoleChangeJobComp, RoleModelJobComp);
        }
        entityEnter(e) {
          // 数值更新
          e.RoleModelJob.id = e.RoleChangeJob.jobId;

          // 转职事件，通知视图层逻辑刷新界面效果，实现两层逻辑分离
          oops.message.dispatchEvent(RoleEvent.ChangeJob);
          e.remove(RoleChangeJobComp);
        }
      }) || _class3));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleEnum.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a8fd6FJ+ktLLIPAwIs4E7n3", "RoleEnum", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-01-26 14:14:34
       * @LastEditors: dgflash
       * @LastEditTime: 2022-01-27 15:49:36
       */

      /** 角色属性类型 */
      let RoleAttributeType = exports('RoleAttributeType', /*#__PURE__*/function (RoleAttributeType) {
        RoleAttributeType["power"] = "power";
        RoleAttributeType["physical"] = "physical";
        RoleAttributeType["agile"] = "agile";
        RoleAttributeType["hp"] = "hp";
        return RoleAttributeType;
      }({}));

      /** 角色动作名 */
      let RoleAnimatorType = exports('RoleAnimatorType', /*#__PURE__*/function (RoleAnimatorType) {
        RoleAnimatorType["Idle"] = "Idle";
        RoleAnimatorType["Attack"] = "Attack";
        RoleAnimatorType["Hurt"] = "Hurt";
        RoleAnimatorType["Dead"] = "Dead";
        return RoleAnimatorType;
      }({}));

      /** 武器名 */
      var WeaponName = exports('WeaponName', {
        0: "Fist",
        1: "Katana",
        2: "CrossGun",
        3: "LongGun",
        4: "Razor",
        5: "Arch",
        6: "Crossbow",
        7: "IronCannon",
        8: "FireGun",
        9: "Wakizashi",
        10: "Kunai",
        11: "Dagger",
        12: "Kusarigama",
        13: "DanceFan",
        14: "Flag",
        15: "MilitaryFan",
        16: "Shield"
      });
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleEvent.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a2e7avXIapN/KtcbdDfuip8", "RoleEvent", undefined);
      /** 角色模块全局事件 */
      let RoleEvent = exports('RoleEvent', /*#__PURE__*/function (RoleEvent) {
        RoleEvent["ChangeJob"] = "ChangeJob";
        return RoleEvent;
      }({}));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleModelBaseComp.ts", ['cc', './ECS.ts', './ViewModel.ts', './RoleEnum.ts', './RoleModelComp.ts'], function (exports) {
  var cclegacy, ecs, VM, RoleAttributeType, RoleModelComp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      VM = module.VM;
    }, function (module) {
      RoleAttributeType = module.RoleAttributeType;
    }, function (module) {
      RoleModelComp = module.RoleModelComp;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "26768Up8GVNw5SfVX2XclVH", "RoleModelBaseComp", undefined);

      /**
       * 角色基础属性数据
       * 
       * 实现功能
       * 1、角色初始创建时有随机的基础战斗属性
       * 2、基础战斗属性会独立显示数值
       * 
       * 技术分析
       * 1、RoleModelComp.attributes 中设计了可扩展的角色战斗属性对象，这里分出来一个基础属性对象，是为了生成 VM 组件需要的数据格式，辅助视图层的显示逻辑
       * 2、这样设计用意是不在 RoleModelComp 对象中插入一个针对基础属性的 VM 数据。这里表达在新增需求时，尽量通过增量开发，不影响原有功能。在项目代码越来越多时，不容易因忽略某个点导致出现新问题。
       */
      let RoleModelBaseComp = exports('RoleModelBaseComp', (_dec = ecs.register('RoleModelBase'), _dec(_class = class RoleModelBaseComp extends ecs.Comp {
        constructor(...args) {
          super(...args);
          /** 提供 VM 组件使用的数据 */
          this.vm = {};
          /** 力量 */
          this._power = 0;
          /** 体质 */
          this._physical = 0;
          /** 敏捷 */
          this._agile = 0;
        }
        get power() {
          return this._power;
        }
        set power(value) {
          this._power = value;
          this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.power).base = value;
          this.vm[RoleAttributeType.power] = value;
        }
        get physical() {
          return this._physical;
        }
        set physical(value) {
          this._physical = value;
          this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.physical).base = value;
          this.vm[RoleAttributeType.physical] = value;
        }
        get agile() {
          return this._agile;
        }
        set agile(value) {
          this._agile = value;
          this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.agile).base = value;
          this.vm[RoleAttributeType.agile] = value;
        }
        vmAdd() {
          VM.add(this.vm, "RoleBase");
        }
        vmRemove() {
          VM.remove("RoleBase");
        }
        reset() {
          this.vmRemove();
          for (var key in this.vm) {
            this.vm[key] = 0;
          }
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleModelComp.ts", ['cc', './ECS.ts', './ViewModel.ts', './RoleNumericMap.ts'], function (exports) {
  var cclegacy, ecs, VM, RoleNumericMap;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      VM = module.VM;
    }, function (module) {
      RoleNumericMap = module.RoleNumericMap;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "0b313MKJh1LE6DVFdJyex29", "RoleModelComp", undefined);
      /** 
       * 角色属性数据 
       * 
       * 实现功能
       * 1、角色唯一基础数据
       * 2、角色战斗属性数据
       * 3、角色VM组件绑定数据
       * 
       * 技术分析
       * 1、使用ecs.Comp做为数据层的基类，是为了后续业务开发过程中，只要ecs.Entity对象中包含了当前数据组件，就可以通过 ecs.Entity.get(RoleModelComp) 的方式获取对应子模块的数据
       */
      let RoleModelComp = exports('RoleModelComp', (_dec = ecs.register('RoleModel'), _dec(_class = class RoleModelComp extends ecs.Comp {
        /** 昵称 */
        get name() {
          return this._name;
        }
        set name(value) {
          this._name = value;
          this.vm.name = value;
        }

        /** 动画名资源 */

        constructor() {
          super();
          /** 角色编号 */
          this.id = -1;
          this._name = "";
          this.anim = "model1";
          /** 角色属性 */
          this.attributes = null;
          /** 提供 VM 组件使用的数据 */
          this.vm = {};
          this.attributes = new RoleNumericMap(this.vm);
        }
        vmAdd() {
          VM.add(this.vm, "Role");
        }
        vmRemove() {
          VM.remove("Role");
        }
        reset() {
          this.vmRemove();
          this.id = -1;
          this.name = "";
          for (var key in this.vm) {
            this.vm[key] = 0;
          }
        }
        toString() {
          console.log(`【${this.name}】的属性"--------------------------------------------`);
          this.attributes.forEach((value, key) => {
            console.log(key, value.value);
          });
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleModelJobComp.ts", ['cc', './ECS.ts', './TableRoleJob.ts', './RoleEnum.ts', './RoleModelComp.ts'], function (exports) {
  var cclegacy, ecs, TableRoleJob, RoleAttributeType, RoleModelComp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      TableRoleJob = module.TableRoleJob;
    }, function (module) {
      RoleAttributeType = module.RoleAttributeType;
    }, function (module) {
      RoleModelComp = module.RoleModelComp;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "6414fy1WmVLuaszw7+aE64/", "RoleModelJobComp", undefined);

      /** 
       * 角色职业数据 
       * 
       * 实现功能
       * 1、影响角色力量、敏捷战斗属性
       * 2、影响角色动画武器
       */
      let RoleModelJobComp = exports('RoleModelJobComp', (_dec = ecs.register('RoleModelJob'), _dec(_class = class RoleModelJobComp extends ecs.Comp {
        constructor(...args) {
          super(...args);
          this.table = new TableRoleJob();
          /** 职业编号编号 */
          this._id = -1;
        }
        get id() {
          return this._id;
        }
        set id(value) {
          this.table.init(value);
          this._id = value;
          var attributes = this.ent.get(RoleModelComp).attributes;
          attributes.get(RoleAttributeType.power).job = this.power;
          attributes.get(RoleAttributeType.agile).job = this.agile;
        }
        /** 职业名 */
        get armsName() {
          return this.table.armsName;
        }
        /** 力量 */
        get power() {
          return this.table.power;
        }
        /** 敏捷 */
        get agile() {
          return this.table.agile;
        }
        /** 武器类型 */
        get weaponType() {
          return this.table.weaponType;
        }
        reset() {
          this._id = -1;
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleModelLevelComp.ts", ['cc', './ECS.ts', './ViewModel.ts', './TableRoleLevelUp.ts'], function (exports) {
  var cclegacy, ecs, VM, TableRoleLevelUp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      VM = module.VM;
    }, function (module) {
      TableRoleLevelUp = module.TableRoleLevelUp;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "9e999Ryb6xKXrcsDo+FAe13", "RoleModelLevelComp", undefined);

      /**
       * 角色等级数据
       * 
       * 实现功能
       * 1、角色等级变化时、获取升级配置表中的生命附加值叠加到角色属性上
       * 
       * 技术分析
       * 1、等级模块直接通过数据访问层的API获取到本地等级配置表数据，通过当前等级匹配到配置表中的等级配置数据
       * 2、获取到的等级配置数据中的生命附加值，叠加到角色战斗属性的等级模块附加值上
       */
      let RoleModelLevelComp = exports('RoleModelLevelComp', (_dec = ecs.register('RoleModelLevel'), _dec(_class = class RoleModelLevelComp extends ecs.Comp {
        constructor(...args) {
          super(...args);
          /** 下个等级配置 */
          this.rtluNext = new TableRoleLevelUp();
          /** 当前等级配置 */
          this.rtluCurrent = new TableRoleLevelUp();
          /** 提供 VM 组件使用的数据 */
          this.vm = new RoleLevelVM();
        }
        vmAdd() {
          VM.add(this.vm, "RoleLevel");
        }
        vmRemove() {
          this.vm.reset();
          VM.remove("RoleLevel");
        }
        reset() {
          this.vmRemove();
        }
      }) || _class));
      class RoleLevelVM {
        constructor() {
          /** 当前等级 */
          this.lv = 0;
          /** 当前经验 */
          this.exp = 0;
          /** 下级经验 */
          this.expNext = 0;
        }
        reset() {
          this.lv = 0;
          this.exp = 0;
          this.expNext = 0;
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleNumeric.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "5565079T3JNp7JldpSO7spj", "RoleNumeric", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-01-20 18:20:32
       * @LastEditors: dgflash
       * @LastEditTime: 2022-02-09 13:11:39
       */
      /** 影响角色属性的模块 */
      let RoleModuleType = exports('RoleModuleType', /*#__PURE__*/function (RoleModuleType) {
        RoleModuleType[RoleModuleType["Base"] = 0] = "Base";
        RoleModuleType[RoleModuleType["Job"] = 1] = "Job";
        RoleModuleType[RoleModuleType["Level"] = 2] = "Level";
        RoleModuleType[RoleModuleType["Equip"] = 3] = "Equip";
        RoleModuleType[RoleModuleType["Decorator"] = 4] = "Decorator";
        RoleModuleType[RoleModuleType["Skill"] = 5] = "Skill";
        return RoleModuleType;
      }({}));

      /** 
       * 角色属性对象
       * 1、不同模块设置对应的属性值
       * 2、任意模块的属性值修改时，自动角色属性更新后的数值和
       */
      class RoleNumeric {
        constructor(type, attributes) {
          /** 数值更新事件 */
          this.onUpdate = null;
          /** 属性类型 */
          this.type = null;
          /** 各模块附加值求和总数值 */
          this.value = 0;
          /** 属性值集合 */
          this.attributes = void 0;
          /** 分组不同模块数值 */
          this.values = new Map();
          this.type = type;
          this.attributes = attributes;

          // 设置初始值
          var rmt = RoleModuleType;
          for (var key in rmt) {
            var k = Number(key);
            if (k > -1) this.values.set(k, 0);
          }
        }

        /** 获取指定模块属性值 */
        getValue(module) {
          return this.values.get(module);
        }

        /** 设置指定模块属性值 */
        setValue(module, value) {
          this.values.set(module, value);
          this.update();
        }
        update() {
          var result = 0;
          this.values.forEach(value => {
            result += value;
          });
          this.value = result;
          this.onUpdate && this.onUpdate(this);
        }
        reset() {
          this.values.clear();
          this.update();
        }

        /** 角色基础属性 */
        get base() {
          return this.getValue(RoleModuleType.Base);
        }
        set base(value) {
          this.setValue(RoleModuleType.Base, value);
        }

        /** 等级属性 */
        get level() {
          return this.getValue(RoleModuleType.Level);
        }
        set level(value) {
          this.setValue(RoleModuleType.Level, value);
        }

        /** 角色职业属性 */
        get job() {
          return this.getValue(RoleModuleType.Job);
        }
        set job(value) {
          this.setValue(RoleModuleType.Job, value);
        }

        /** 角色装备属性 */
        get equip() {
          return this.getValue(RoleModuleType.Equip);
        }
        set equip(value) {
          this.setValue(RoleModuleType.Equip, value);
        }

        /** 修饰器属性 */
        get decorator() {
          return this.getValue(RoleModuleType.Decorator);
        }
        set decorator(value) {
          this.setValue(RoleModuleType.Decorator, value);
        }

        /** 技能附加属性 */
        get skill() {
          return this.getValue(RoleModuleType.Skill);
        }
        set skill(value) {
          this.setValue(RoleModuleType.Skill, value);
        }
      }
      exports('RoleNumeric', RoleNumeric);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleNumericMap.ts", ['cc', './RoleEnum.ts', './RoleNumeric.ts'], function (exports) {
  var cclegacy, RoleAttributeType, RoleNumeric;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      RoleAttributeType = module.RoleAttributeType;
    }, function (module) {
      RoleNumeric = module.RoleNumeric;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e317eRM1yRMLbPql0r+/Pvt", "RoleNumericMap", undefined);

      /** 角色数值装饰器 */
      class RoleNumericDecorator {
        constructor() {
          /** 属性类型 */
          this.attribute = null;
          /** 属性数值 */
          this.value = 0;
        }
      }
      exports('RoleNumericDecorator', RoleNumericDecorator);

      /** 所有模块角色属性集合 */
      class RoleNumericMap {
        constructor(vm) {
          /** 角色属性 */
          this.attributes = new Map();
          /** 角色属性修饰器 */
          this.decorators = new Map();
          /** ＶＭ组件数据 */
          this.vm = null;
          this.vm = vm;
        }

        /** 添加属性修饰器 */
        addDecorator(rnd) {
          this.decorators.set(rnd, rnd.value);
          var rn = this.get(rnd.attribute);
          rn.decorator += rnd.value;
        }

        /** 移除属性修饰器 */
        removeDecorator(rnd) {
          this.decorators.delete(rnd);
          var rn = this.get(rnd.attribute);
          rn.decorator -= rnd.value;
        }

        /** 获取角色属性 */
        get(type) {
          var attr = this.attributes.get(type);
          if (attr == null) {
            switch (type) {
              case RoleAttributeType.physical:
                attr = new RoleNumericPhysical(type, this);
                break;
              default:
                attr = new RoleNumeric(type, this);
                break;
            }
            this.attributes.set(type, attr);
            attr.onUpdate = rn => {
              this.vm[rn.type] = rn.value;
            };
          }
          return attr;
        }
        forEach(callbackfn, thisArg) {
          this.attributes.forEach(callbackfn, thisArg);
        }

        /** 重置属性值为零 */
        reset() {
          this.decorators.clear();
          this.attributes.forEach((value, key, map) => {
            value.reset();
          });
        }
      }
      exports('RoleNumericMap', RoleNumericMap);

      /** 体质属性 */
      class RoleNumericPhysical extends RoleNumeric {
        update() {
          super.update();

          // 每点体质 = 0.5 生命
          this.attributes.get(RoleAttributeType.hp).base = Math.floor(this.value * 0.5);
        }
      }
      exports('RoleNumericPhysical', RoleNumericPhysical);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleStateAttack.ts", ['cc', './AnimatorStateLogic.ts'], function (exports) {
  var cclegacy, AnimatorStateLogic;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      AnimatorStateLogic = module.AnimatorStateLogic;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f4792dE0/lNSY7msDRYmNIF", "RoleStateAttack", undefined);
      /** 攻击状态逻辑 */
      class RoleStateAttack extends AnimatorStateLogic {
        constructor(role, anim) {
          super();
          this.role = void 0;
          this.anim = void 0;
          this.role = role;
          this.anim = anim;
          this.anim.addFrameEvent("attack", this.onAttack, this);
        }
        onAttack() {
          var onAttackComplete = this.role.RoleView.animator.onAttackComplete;
          onAttackComplete && onAttackComplete();
        }
        onEntry() {}
        onUpdate() {}
        onExit() {}
      }
      exports('RoleStateAttack', RoleStateAttack);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleStateDead.ts", ['cc', './AnimatorStateLogic.ts'], function (exports) {
  var cclegacy, AnimatorStateLogic;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      AnimatorStateLogic = module.AnimatorStateLogic;
    }],
    execute: function () {
      cclegacy._RF.push({}, "9ee6921FUJOyJsXWxCQ1Hz7", "RoleStateDead", undefined);
      /** 受击状态逻辑 */
      class RoleStateDead extends AnimatorStateLogic {
        constructor(role, anim) {
          super();
          this.role = void 0;
          this.anim = void 0;
          this.role = role;
          this.anim = anim;
          this.anim.addFrameEvent("dead", this.onDead, this);
        }
        onDead() {
          var onHitActionComplete = this.role.RoleView.animator.onHitActionComplete;
          onHitActionComplete && onHitActionComplete();
        }
        onEntry() {}
        onUpdate() {}
        onExit() {}
      }
      exports('RoleStateDead', RoleStateDead);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleStateHit.ts", ['cc', './AnimatorStateLogic.ts'], function (exports) {
  var cclegacy, AnimatorStateLogic;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      AnimatorStateLogic = module.AnimatorStateLogic;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ea68b0h5RhMXJJQkkMM4LdM", "RoleStateHit", undefined);
      /** 受击状态逻辑 */
      class RoleStateHit extends AnimatorStateLogic {
        constructor(role, anim) {
          super();
          this.role = void 0;
          this.anim = void 0;
          this.role = role;
          this.anim = anim;
        }
        onEntry() {}
        onUpdate() {}
        onExit() {
          var onHitActionComplete = this.role.RoleView.animator.onHitActionComplete;
          onHitActionComplete && onHitActionComplete();
        }
      }
      exports('RoleStateHit', RoleStateHit);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleUpgrade.ts", ['cc', './ECS.ts', './RoleEnum.ts', './RoleModelLevelComp.ts'], function (exports) {
  var cclegacy, ecs, RoleAttributeType, RoleModelLevelComp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      RoleAttributeType = module.RoleAttributeType;
    }, function (module) {
      RoleModelLevelComp = module.RoleModelLevelComp;
    }],
    execute: function () {
      var _dec, _class, _dec2, _class3;
      cclegacy._RF.push({}, "7750bmim9xAjqAgrvhP5she", "RoleUpgrade", undefined);
      /**
       * 角色升级
       */
      let RoleUpgradeComp = exports('RoleUpgradeComp', (_dec = ecs.register('RoleUpgrade'), _dec(_class = class RoleUpgradeComp extends ecs.Comp {
        constructor(...args) {
          super(...args);
          /** 当前等级 */
          this.lv = 0;
        }
        reset() {
          this.lv = 0;
        }
      }) || _class));
      let RoleUpgradeSystem = exports('RoleUpgradeSystem', (_dec2 = ecs.register('Role'), _dec2(_class3 = class RoleUpgradeSystem extends ecs.ComblockSystem {
        filter() {
          return ecs.allOf(RoleUpgradeComp, RoleModelLevelComp);
        }
        entityEnter(e) {
          let rm = e.RoleModel;
          let rlm = e.RoleModelLevel;
          let ru = e.RoleUpgrade;
          if (ru.lv == 0) rlm.vm.lv++; // 提升一级
          else rlm.vm.lv = ru.lv; // 设置等级

          // 当前等级配置
          rlm.rtluCurrent.init(rlm.vm.lv);
          // 等级附加属性
          rm.attributes.get(RoleAttributeType.hp).level = rlm.rtluCurrent.hp;

          // 下个等级配置
          rlm.rtluNext.init(rlm.vm.lv + 1);
          rlm.vm.expNext = rlm.rtluNext.needexp;
          e.remove(RoleUpgradeComp);
        }
      }) || _class3));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleViewAnimator.ts", ['cc', './AnimatorSpine.ts', './RoleEnum.ts', './AnimationEventHandler.ts', './RoleStateAttack.ts', './RoleStateDead.ts', './RoleStateHit.ts'], function (exports) {
  var cclegacy, sp, _decorator, AnimatorSpine, RoleAnimatorType, WeaponName, AnimationEventHandler, RoleStateAttack, RoleStateDead, RoleStateHit;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sp = module.sp;
      _decorator = module._decorator;
    }, function (module) {
      AnimatorSpine = module.default;
    }, function (module) {
      RoleAnimatorType = module.RoleAnimatorType;
      WeaponName = module.WeaponName;
    }, function (module) {
      AnimationEventHandler = module.AnimationEventHandler;
    }, function (module) {
      RoleStateAttack = module.RoleStateAttack;
    }, function (module) {
      RoleStateDead = module.RoleStateDead;
    }, function (module) {
      RoleStateHit = module.RoleStateHit;
    }],
    execute: function () {
      var _dec, _dec2, _class;
      cclegacy._RF.push({}, "a1be2AiDydHLZfm1EWsPQ34", "RoleViewAnimator", undefined);
      const {
        ccclass,
        property,
        requireComponent,
        disallowMultiple
      } = _decorator;

      /** 
       * 角色SPINE动画控制
       * 
       * 实现功能
       * 1、控制动作变化
       * 2、控制武器变化
       * 3、控制脸的朝向
       */
      let RoleViewAnimator = exports('RoleViewAnimator', (_dec = ccclass("RoleViewAnimator"), _dec2 = requireComponent(sp.Skeleton), _dec(_class = disallowMultiple(_class = _dec2(_class = class RoleViewAnimator extends AnimatorSpine {
        constructor(...args) {
          super(...args);
          /** 攻击行为完成 */
          this.onAttackComplete = null;
          /** 受击动作完成 */
          this.onHitActionComplete = null;
          /** 角色对象 */
          this.role = null;
          /** 武器动画名 */
          this.weaponAnimName = null;
        }
        start() {
          super.start();

          // 动画状态机
          let anim = new AnimationEventHandler();
          let asl = new Map();
          asl.set(RoleAnimatorType.Attack, new RoleStateAttack(this.role, anim));
          asl.set(RoleAnimatorType.Hurt, new RoleStateHit(this.role, anim));
          asl.set(RoleAnimatorType.Dead, new RoleStateDead(this.role, anim));
          this.initArgs(asl, anim);
        }

        /** 面象朝左 */
        left() {
          this.node.parent.setScale(1, 1, 1);
        }

        /** 面象朝右 */
        right() {
          this.node.parent.setScale(-1, 1, 1);
        }

        /** 当前动作换职业动画 */
        refresh() {
          // 状态机状态值未变时，不会触发状态变化事件，所以这里直接触发状态变化事件来触发后续流程
          this.onStateChange(this._ac.curState, this._ac.curState);
        }

        /**
         * 播放动画
         * @override
         * @param animName 动画名
         * @param loop 是否循环播放
         */
        playAnimation(animName, loop) {
          if (animName) {
            this.weaponAnimName = this.getWeaponAnimName();
            var name = `${animName}_${this.weaponAnimName}`;
            this._spine.setAnimation(0, name, loop);
          } else {
            this._spine.clearTrack(0);
          }
        }

        /** 武器动画剪辑名 */
        getWeaponAnimName() {
          var job = this.role.RoleModelJob;
          var weaponAnimName = WeaponName[job.weaponType[0]];
          return weaponAnimName;
        }
      }) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleViewComp.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ECS.ts', './CCComp.ts', './RoleEvent.ts', './RoleViewAnimator.ts', './RoleViewController.ts', './RoleViewLoader.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, sp, _decorator, ecs, CCComp, RoleEvent, RoleViewAnimator, RoleViewController, RoleViewLoader;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      sp = module.sp;
      _decorator = module._decorator;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      CCComp = module.CCComp;
    }, function (module) {
      RoleEvent = module.RoleEvent;
    }, function (module) {
      RoleViewAnimator = module.RoleViewAnimator;
    }, function (module) {
      RoleViewController = module.RoleViewController;
    }, function (module) {
      RoleViewLoader = module.RoleViewLoader;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "60726sarbtIDJfLLE+75yKL", "RoleViewComp", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 角色显示组件 */
      let RoleViewComp = exports('RoleViewComp', (_dec = ccclass('RoleViewComp'), _dec2 = ecs.register('RoleView', false), _dec3 = property({
        type: sp.Skeleton,
        tooltip: '角色动画'
      }), _dec(_class = _dec2(_class = (_class2 = class RoleViewComp extends CCComp {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "spine", _descriptor, this);
          /** 角色动画资源管理 */
          this.loader = null;
          /** 角色动画规则管理 */
          this.animator = null;
          /** 角色控制器 */
          this.controller = null;
        }
        /** 视图层逻辑代码分离演示 */
        onLoad() {
          var role = this.ent;
          this.loader = this.node.addComponent(RoleViewLoader);
          this.node.emit("load", role);
          this.animator = this.spine.getComponent(RoleViewAnimator);
          this.animator.role = role;
          this.controller = this.node.addComponent(RoleViewController);
          this.controller.role = role;
          this.on(RoleEvent.ChangeJob, this.onHandler, this);
        }

        /** 业务层全局消息通知视图层逻辑处理，两层之间逻辑解耦合演示 */
        onHandler(event, args) {
          switch (event) {
            case RoleEvent.ChangeJob:
              this.animator.refresh();
              break;
          }
        }
        reset() {
          this.node.destroy();
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "spine", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleViewController.ts", ['cc', './Oops.ts'], function (exports) {
  var cclegacy, Component, Node, UITransform, v3, _decorator, oops;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Node = module.Node;
      UITransform = module.UITransform;
      v3 = module.v3;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "2a2ffJk1U9GaJF7CVOOUP2i", "RoleViewController", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 角色资源加载 */
      let RoleViewController = exports('RoleViewController', (_dec = ccclass('RoleViewController'), _dec(_class = class RoleViewController extends Component {
        constructor(...args) {
          super(...args);
          /** 角色对象 */
          this.role = null;
        }
        onLoad() {
          oops.gui.game.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        onTouchEnd(event) {
          // 注：角色移动控制代码在RPG类游戏中，应该设计到地图模块监听触摸事件。因为测试代码只有一个角色，为了简少DEMO代码量，只表达程序设计思想
          var uit = this.node.parent.getComponent(UITransform);
          var x = event.getUILocation().x - uit.contentSize.width / 2;
          var y = event.getUILocation().y - uit.contentSize.height / 2;
          this.role.move(v3(x, y));
          if (x < this.role.RoleView.node.position.x) this.role.RoleView.animator.left();else this.role.RoleView.animator.right();
        }
        onDestroy() {
          oops.gui.game.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleViewInfoComp.ts", ['cc', './Oops.ts', './ECS.ts', './CCComp.ts', './GameUIConfig.ts', './SingletonModuleComp.ts'], function (exports) {
  var cclegacy, Node, _decorator, oops, ecs, CCComp, UIID, SingletonModuleComp;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      ecs = module.ecs;
    }, function (module) {
      CCComp = module.CCComp;
    }, function (module) {
      UIID = module.UIID;
    }, function (module) {
      SingletonModuleComp = module.SingletonModuleComp;
    }],
    execute: function () {
      var _dec, _dec2, _class;
      cclegacy._RF.push({}, "0f2264R4d1JMpV/ODghFMkE", "RoleViewInfoComp", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 角色信息界面 */
      let RoleViewInfoComp = exports('RoleViewInfoComp', (_dec = ccclass('RoleViewInfoComp'), _dec2 = ecs.register('RoleViewInfo', false), _dec(_class = _dec2(_class = class RoleViewInfoComp extends CCComp {
        onAdded(args) {
          console.log(args);
        }
        onLoad() {
          this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        onTouchEnd(event) {
          switch (event.target.name) {
            case "btn_levelup":
              var role = ecs.getSingleton(SingletonModuleComp).account.AccountModel.role;
              role.upgrade();
              break;
            case "btn_close":
              this.ent.remove(RoleViewInfoComp);
              break;
          }
          event.propagationStopped = true;
        }
        reset() {
          oops.gui.remove(UIID.Demo_Role_Info, false);

          // 注：模拟二次删除清理缓存
          setTimeout(() => {
            oops.gui.remove(UIID.Demo_Role_Info);
          }, 1000);
        }
        onDestroy() {
          console.log("释放角色信息界面");
        }
      }) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoleViewLoader.ts", ['cc', './Oops.ts', './GameResPath.ts'], function (exports) {
  var cclegacy, Component, sp, _decorator, oops, GameResPath;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      sp = module.sp;
      _decorator = module._decorator;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      GameResPath = module.GameResPath;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "f8b09G7r6VIcbm3bJOdQS16", "RoleViewLoader", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 角色资源加载 */
      let RoleViewLoader = exports('RoleViewLoader', (_dec = ccclass('RoleViewLoader'), _dec(_class = class RoleViewLoader extends Component {
        constructor(...args) {
          super(...args);
          this.spine = null;
        }
        onLoad() {
          this.node.on("load", this.onEmitLoad, this);
        }
        onEmitLoad(role) {
          this.spine = role.RoleView.spine;
          this.load(role.RoleModel.anim);
        }
        load(name) {
          this.node.active = false;
          var path = GameResPath.getRolePath(name);
          oops.res.load(path, sp.SkeletonData, (err, sd) => {
            if (err) {
              console.error(`动画名为【${path}】的角色资源不存在`);
              return;
            }
            this.spine.skeletonData = sd;
            this.spine.skeletonData.addRef();
            this.node.active = true;
          });
        }
        onDestroy() {
          if (this.spine.skeletonData) this.spine.skeletonData.decRef();
        }
      }) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Root.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Language.ts', './GameConfig.ts', './GameQueryConfig.ts', './Oops.ts', './AudioManager.ts', './EventMessage.ts', './TimerManager.ts', './GameManager.ts', './GUI.ts', './LayerManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component, JsonAsset, game, director, Game, sys, screen, LanguageManager, GameConfig, GameQueryConfig, version, oops, AudioManager, EventMessage, TimerManager, GameManager, GUI, LayerManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      JsonAsset = module.JsonAsset;
      game = module.game;
      director = module.director;
      Game = module.Game;
      sys = module.sys;
      screen = module.screen;
    }, function (module) {
      LanguageManager = module.LanguageManager;
    }, function (module) {
      GameConfig = module.GameConfig;
    }, function (module) {
      GameQueryConfig = module.GameQueryConfig;
    }, function (module) {
      version = module.version;
      oops = module.oops;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      EventMessage = module.EventMessage;
    }, function (module) {
      TimerManager = module.TimerManager;
    }, function (module) {
      GameManager = module.GameManager;
    }, function (module) {
      GUI = module.GUI;
    }, function (module) {
      LayerManager = module.LayerManager;
    }],
    execute: function () {
      var _dec, _dec2, _class, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "90b9cOmlmBCnpCpEpgvdrQr", "Root", undefined);
      const {
        property
      } = _decorator;
      var isInited = false;

      /** 框架显示层根节点 */
      let Root = exports('Root', (_dec = property({
        type: Node,
        tooltip: "游戏层"
      }), _dec2 = property({
        type: Node,
        tooltip: "界面层"
      }), (_class = class Root extends Component {
        constructor(...args) {
          super(...args);
          /** 游戏层节点 */
          _initializerDefineProperty(this, "game", _descriptor, this);
          // 可使用多摄像机自定义二维或三维游戏场景
          /** 界面层节点 */
          _initializerDefineProperty(this, "gui", _descriptor2, this);
          /** 持久根节点 */
          this.persistRootNode = null;
        }
        onLoad() {
          if (!isInited) {
            isInited = true; // 注：这里是规避cc3.8在编辑器模式下运行时，关闭游戏会两次初始化报错

            console.log(`Oops Framework v${version}`);
            this.enabled = false;
            let config_name = "config";
            oops.res.load(config_name, JsonAsset, () => {
              var config = oops.res.get(config_name);
              // oops.config.btc = new BuildTimeConstants();
              oops.config.query = new GameQueryConfig();
              oops.config.game = new GameConfig(config);
              oops.http.server = oops.config.game.httpServer; // Http 服务器地址
              oops.http.timeout = oops.config.game.httpTimeout; // Http 请求超时时间
              oops.storage.init(oops.config.game.localDataKey, oops.config.game.localDataIv); // 初始化本地存储加密
              game.frameRate = oops.config.game.frameRate; // 初始化每秒传输帧数

              this.enabled = true;
              this.init();
              this.run();
            });
          }
        }
        update(dt) {
          oops.ecs.execute(dt);
        }

        /** 初始化游戏界面 */
        initGui() {}

        /** 初始化游戏业务模块 */
        initEcsSystem() {}

        /** 加载完引擎配置文件后执行 */
        run() {}
        init() {
          // 创建持久根节点
          this.persistRootNode = new Node("PersistRootNode");
          director.addPersistRootNode(this.persistRootNode);

          // 创建音频模块
          oops.audio = this.persistRootNode.addComponent(AudioManager);
          oops.audio.load();

          // 创建时间模块
          oops.timer = this.persistRootNode.addComponent(TimerManager);
          oops.language = new LanguageManager();
          oops.game = new GameManager(this.game);
          oops.gui = new LayerManager(this.gui);
          this.initGui();
          this.initEcsSystem();
          oops.ecs.init();

          // 游戏显示事件
          game.on(Game.EVENT_SHOW, () => {
            oops.timer.load(); // 平台不需要在退出时精准计算时间，直接暂时游戏时间
            oops.audio.resumeAll();
            director.resume();
            game.resume();
            oops.message.dispatchEvent(EventMessage.GAME_SHOW);
          });

          // 游戏隐藏事件
          game.on(Game.EVENT_HIDE, () => {
            oops.timer.save(); // 平台不需要在退出时精准计算时间，直接暂时游戏时间
            oops.audio.pauseAll();
            director.pause();
            game.pause();
            oops.message.dispatchEvent(EventMessage.GAME_HIDE);
          });

          // 游戏尺寸修改事件
          var c_gui = this.gui.addComponent(GUI);
          if (sys.isMobile == false) {
            screen.on("window-resize", () => {
              c_gui.resize();
              oops.message.dispatchEvent(EventMessage.GAME_RESIZE);
            }, this);
            screen.on("fullscreen-change", () => {
              oops.message.dispatchEvent(EventMessage.GAME_FULL_SCREEN);
            }, this);
          }
          screen.on("orientation-change", () => {
            oops.message.dispatchEvent(EventMessage.GAME_ORIENTATION);
          }, this);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "game", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "gui", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class)));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RotateUtil.ts", ['cc', './Vec3Util.ts'], function (exports) {
  var cclegacy, Quat, Vec3, toRadian, Vec3Util;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Quat = module.Quat;
      Vec3 = module.Vec3;
      toRadian = module.toRadian;
    }, function (module) {
      Vec3Util = module.Vec3Util;
    }],
    execute: function () {
      cclegacy._RF.push({}, "103324kr75Hi5d7RZCcRt3P", "RotateUtil", undefined);

      /** 旋转工具 */
      class RotateUtil {
        /**
         * 自由旋转
         * @param target     旋转目标
         * @param axis       围绕旋转的轴
         * @param rad        旋转弧度
         */
        static rotateAround(target, axis, rad) {
          var quat = new Quat();
          Quat.rotateAround(quat, target.getRotation(), axis.normalize(), rad);
          target.setRotation(quat);
        }

        /**
         * 参考瞄准目标,使当前物体围绕瞄准目标旋转
         * 1、先通过弧度计算旋转四元数
         * 2、通过旋转中心点或当前目标点向量相减计算出移动方向
         * 3、计算起始向量旋转后的向量
         * 4、计算旋转后的坐标点
         * @param lookAt  瞄准目标
         * @param target        旋转目标
         * @param axis          围绕旋转的轴(例：Vec3.UP为Y轴)
         * @param rad           旋转弧度(例：delta.x * 1e-2)
         */
        static rotateAroundTarget(lookAt, target, axis, rad) {
          // 计算坐标
          var point_lookAt = lookAt.worldPosition; // 锚点坐标
          var point_target = target.worldPosition; // 目标坐标
          var quat = new Quat();
          var vec3 = new Vec3();

          // 算出坐标点的旋转四元数
          Quat.fromAxisAngle(quat, axis, rad);
          // 计算旋转点和现有点的向量
          Vec3.subtract(vec3, point_target, point_lookAt);
          // 计算将向量做旋转操作后的向量
          Vec3.transformQuat(vec3, vec3, quat);
          // 计算目标旋转后的点
          Vec3.add(vec3, point_lookAt, vec3);
          target.setWorldPosition(vec3);

          // 计算目标朝向瞄准点
          Quat.rotateAround(quat, target.worldRotation, axis, rad);
          Quat.normalize(quat, quat);
          target.setWorldRotation(quat);
        }

        /**
         * 获取心半径边上的位置
         * @param center    圆心
         * @param radius    半径
         * @param angle     角度
         */
        static circularEdgePosition(center, radius, angle) {
          let edge = Vec3Util.z.multiplyScalar(radius); // 距离圆心Z抽的距离
          let dir = Vec3Util.sub(edge, center); // 初始圆心与目标位置的方向
          let vec3 = new Vec3();
          var quat = new Quat();

          // 算出坐标点的旋转四元数
          Quat.fromAxisAngle(quat, Vec3.UP, toRadian(angle));
          // 计算将向量做旋转操作后的向量
          Vec3.transformQuat(vec3, dir, quat);
          // 计算目标旋转后的点
          Vec3.add(vec3, center, vec3);
          return vec3;
        }
      }
      exports('RotateUtil', RotateUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RoundRectMask.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Mask, CCFloat, _decorator, Component, UITransform, game, Game;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Mask = module.Mask;
      CCFloat = module.CCFloat;
      _decorator = module._decorator;
      Component = module.Component;
      UITransform = module.UITransform;
      game = module.game;
      Game = module.Game;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "da0f8CBQkZDqaekNuERqKjA", "RoundRectMask", undefined);
      const {
        ccclass,
        property,
        executeInEditMode,
        disallowMultiple,
        requireComponent,
        menu
      } = _decorator;
      let RoundRectMask = exports('RoundRectMask', (_dec = ccclass('RoundRectMask'), _dec2 = executeInEditMode(true), _dec3 = disallowMultiple(true), _dec4 = requireComponent(Mask), _dec5 = menu('渲染组件/圆角遮罩'), _dec6 = property({
        type: CCFloat,
        tooltip: '圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值'
      }), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (_class2 = class RoundRectMask extends Component {
        constructor(...args) {
          super(...args);
          // 圆角半径
          _initializerDefineProperty(this, "propRadius", _descriptor, this);
          this.mask = null;
        }
        get radius() {
          return this.propRadius;
        }
        set radius(r) {
          this.propRadius = r;
          this.updateMask(r);
        }
        onEnable() {
          this.mask = this.getComponent(Mask);
          this.updateMask(this.radius);
        }
        updateMask(r) {
          let _radius = r >= 0 ? r : 0;
          if (_radius < 1) {
            const uiTransform = this.node.getComponent(UITransform);
            _radius = Math.min((uiTransform == null ? void 0 : uiTransform.width) || 0, (uiTransform == null ? void 0 : uiTransform.width) || 0) * _radius;
          }
          if (this.mask) {
            // @ts-ignore.
            this.mask['radius'] = _radius;
            // @ts-ignore.
            this.mask['onDraw'] = this.onDraw.bind(this.mask);
            this.mask['_updateGraphics'] = this._updateGraphics.bind(this.mask);
            this.mask.type = Mask.Type.GRAPHICS_RECT;
          }
        }
        _updateGraphics() {
          // @ts-ignore.
          let graphics = this._graphics;
          if (!graphics) {
            return;
          }
          this.onDraw(graphics);
        }

        /**
         * mask 用于绘制罩子的函数.
         * this 指向mask 对象,需要特别注意.
         * @param graphics
         */
        onDraw(graphics) {
          const uiTransform = this.node.getComponent(UITransform);
          graphics.clear();
          let width = uiTransform.width;
          let height = uiTransform.height;
          let x = -width * uiTransform.anchorX;
          let y = -height * uiTransform.anchorY;
          graphics.roundRect(x, y, width, height, this.radius || 0);
          if (game.renderType === Game.RENDER_TYPE_CANVAS) {
            graphics.stroke();
          } else {
            graphics.fill();
          }
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "propRadius", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 50;
        }
      }), _class2)) || _class) || _class) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RtToModel.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      // import { Camera, Component, gfx, MeshRenderer, RenderTexture, view, _decorator } from 'cc';
      cclegacy._RF.push({}, "dbd7dMQYutDs7I7uj+3zIiU", "RtToModel", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RtToSprite.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Camera, Sprite, Node, _decorator, Component, RenderTexture, UITransform, gfx, SpriteFrame;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Camera = module.Camera;
      Sprite = module.Sprite;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      RenderTexture = module.RenderTexture;
      UITransform = module.UITransform;
      gfx = module.gfx;
      SpriteFrame = module.SpriteFrame;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "f608cdDWBNEKLILVNBcQYvf", "RtToSprite", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 三维模型显示到二维精灵上 */
      let RtToSprite = exports('RtToSprite', (_dec = ccclass('RtToSprite'), _dec2 = property({
        type: Camera,
        tooltip: "渲染模型的三维摄像机"
      }), _dec3 = property({
        type: Sprite,
        tooltip: "显示模型的二维精灵组件"
      }), _dec4 = property({
        tooltip: "是否触摸控制旋转"
      }), _dec5 = property({
        type: Node,
        tooltip: "三维模型",
        visible: function () {
          //@ts-ignore
          return this.rotation === true;
        }
      }), _dec(_class = (_class2 = class RtToSprite extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "camera", _descriptor, this);
          _initializerDefineProperty(this, "sprite", _descriptor2, this);
          _initializerDefineProperty(this, "rotation", _descriptor3, this);
          _initializerDefineProperty(this, "model", _descriptor4, this);
          this.rt = new RenderTexture();
          this.touched = false;
        }
        // 是否触摸节点

        start() {
          let size = this.sprite.getComponent(UITransform);
          this.refreshRenderTexture(size.width, size.height);
          if (this.rotation) {
            this.sprite.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.sprite.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.sprite.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.sprite.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          }
        }
        onTouchStart(event) {
          this.touched = true;
        }
        onTouchMove(event) {
          if (this.touched) {
            let eulerAngles = this.model.eulerAngles;
            let deltaX = event.touch.getDelta().x;
            eulerAngles.y += -deltaX;
            this.model.eulerAngles = eulerAngles;
          }
        }
        onTouchEnd(event) {
          this.touched = false;
        }

        /** 刷新纹理内容 */
        refreshRenderTexture(w, h) {
          const colorAttachment = new gfx.ColorAttachment();
          const depthStencilAttachment = new gfx.DepthStencilAttachment();
          const pi = new gfx.RenderPassInfo([colorAttachment], depthStencilAttachment);
          this.rt.reset({
            width: w,
            height: h,
            passInfo: pi
          });
          let spriteframe = this.sprite.spriteFrame;
          let sp = new SpriteFrame();
          sp.reset({
            originalSize: spriteframe.originalSize,
            rect: spriteframe.rect,
            offset: spriteframe.offset,
            isRotate: spriteframe.rotated,
            borderTop: spriteframe.insetTop,
            borderLeft: spriteframe.insetLeft,
            borderBottom: spriteframe.insetBottom,
            borderRight: spriteframe.insetRight
          });
          this.camera.targetTexture = this.rt;
          sp.texture = this.rt;
          this.sprite.spriteFrame = sp;
        }
        onDestroy() {
          if (this.rotation) {
            this.sprite.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.sprite.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.sprite.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.sprite.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          }
          this.rt.destroy();
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "camera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sprite", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "rotation", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "model", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Selector.ts", ['cc', './BranchNode.ts'], function (exports) {
  var cclegacy, BranchNode;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BranchNode = module.BranchNode;
    }],
    execute: function () {
      cclegacy._RF.push({}, "90470XqT/FGHo/PRQktLcYy", "Selector", undefined);

      /** 
       * 逻辑或关系
       * 只要子节点有一个返回true，则停止执行其它子节点，并且Selector返回true。如果所有子节点都返回false，则Selector返回false。
       */
      class Selector extends BranchNode {
        success() {
          super.success();
          this._control.success();
        }
        fail() {
          super.fail();
          this._actualTask += 1;
          if (this._actualTask < this.children.length) {
            this._run(this._blackboard);
          } else {
            this._control.fail();
          }
        }
        _run(blackboard) {
          if (this._nodeRunning) {
            this._nodeRunning.run(this._blackboard);
          } else {
            super._run();
          }
        }
      }
      exports('Selector', Selector);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Sequence.ts", ['cc', './BranchNode.ts'], function (exports) {
  var cclegacy, BranchNode;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BranchNode = module.BranchNode;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1ef80bgYZBPXqCDIpzHpbBJ", "Sequence", undefined);
      /** 
       * 逻辑与关系
       * 只要有一个子节点返回false，则停止执行其它子节点，并且Sequence返回false。如果所有子节点都返回true，则Sequence返回true。
       */
      class Sequence extends BranchNode {
        constructor(nodes) {
          super(nodes);
        }
        success() {
          super.success();
          this._actualTask += 1;
          if (this._actualTask < this.children.length) {
            this._run(this._blackboard);
          } else {
            this._control.success();
          }
        }
        fail() {
          super.fail();
          this._control.fail();
        }
        _run(blackboard) {
          if (this._nodeRunning) {
            this._nodeRunning.run(this._blackboard);
          } else {
            super._run();
          }
        }
      }
      exports('Sequence', Sequence);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SingletonModuleComp.ts", ['cc', './ECS.ts'], function (exports) {
  var cclegacy, ecs;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ecs = module.ecs;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "c11472aPc1P0K2H9Nlk7mKo", "SingletonModuleComp", undefined);
      /** 游戏模块 */
      let SingletonModuleComp = exports('SingletonModuleComp', (_dec = ecs.register('SingletonModule'), _dec(_class = class SingletonModuleComp extends ecs.Comp {
        constructor(...args) {
          super(...args);
          /** 游戏初始化模块 */
          this.initialize = null;
        }
        /** 游戏账号模块 */
        get account() {
          return this.initialize.account;
        }
        reset() {}
      }) || _class));
      var smc = exports('smc', ecs.getSingleton(SingletonModuleComp));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SpineFinishedRelease.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Oops.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Component, sp, oops;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      sp = module.sp;
    }, function (module) {
      oops = module.oops;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "9589eKB/RZKXpxoYhz5SyC7", "SpineFinishedRelease", undefined);
      const {
        ccclass,
        property
      } = _decorator;

      /** 动画播放完隐藏特效 */
      let SpineFinishedRelease = exports('SpineFinishedRelease', (_dec = ccclass('SpineFinishedRelease'), _dec(_class = (_class2 = class SpineFinishedRelease extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "isDestroy", _descriptor, this);
          this.spine = void 0;
          this.resPath = null;
        }
        /** 设置路径 */
        setResPath(path) {
          this.resPath = path;
        }
        onLoad() {
          this.spine = this.getComponent(sp.Skeleton);
          this.spine.setCompleteListener(this.onSpineComplete.bind(this));
          if (this.resPath) {
            oops.res.load(this.resPath, sp.SkeletonData, (err, sd) => {
              if (err) {
                console.error(`加载【${this.resPath}】的 SPINE 资源不存在`);
                return;
              }
              this.spine.skeletonData = sd;
              this.spine.setAnimation(0, "animation", false);
            });
          } else {
            this.spine.setAnimation(0, "animation", false);
          }
        }
        onSpineComplete() {
          if (this.isDestroy) {
            this.node.destroy();
          } else {
            this.node.removeFromParent();
          }
        }
      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "isDestroy", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/StorageManager.ts", ['cc', './env', './EncryptUtil.ts'], function (exports) {
  var cclegacy, sys, PREVIEW, EncryptUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      PREVIEW = module.PREVIEW;
    }, function (module) {
      EncryptUtil = module.EncryptUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ed226gLF85Oyr+WhA9TJZLX", "StorageManager", undefined);

      /** 本地存储 */
      class StorageManager {
        constructor() {
          this._key = null;
          this._iv = null;
          this._id = null;
        }
        /**
         * 初始化密钥
         * @param key aes加密的key 
         * @param iv  aes加密的iv
         */
        init(key, iv) {
          EncryptUtil.initCrypto(key, iv);
          this._key = EncryptUtil.md5(key);
          this._iv = EncryptUtil.md5(iv);
        }

        /**
         * 设置用户唯一标识
         * @param id 
         */
        setUser(id) {
          this._id = id;
        }

        /**
         * 存储本地数据
         * @param key 存储key
         * @param value 存储值
         * @returns 
         */
        set(key, value) {
          var keywords = this.getKey(key);
          if (null == key) {
            console.error("存储的key不能为空");
            return;
          }
          if (this.encrypted) {
            keywords = EncryptUtil.md5(keywords);
          }
          if (null == value) {
            console.warn("存储的值为空，则直接移除该存储");
            this.remove(key);
            return;
          }
          if (typeof value === 'function') {
            console.error("储存的值不能为方法");
            return;
          }
          if (typeof value === 'object') {
            try {
              value = JSON.stringify(value);
            } catch (e) {
              console.error(`解析失败，str = ${value}`);
              return;
            }
          } else if (typeof value === 'number') {
            value = value + "";
          }
          if (this.encrypted && null != this._key && null != this._iv) {
            value = EncryptUtil.aesEncrypt(`${value}`, this._key, this._iv);
          }
          sys.localStorage.setItem(keywords, value);
        }

        /**
         * 获取指定关键字的数据
         * @param key          获取的关键字
         * @param defaultValue 获取的默认值
         * @returns 
         */
        get(key, defaultValue = "") {
          if (null == key) {
            console.error("存储的key不能为空");
            return null;
          }
          key = this.getKey(key);
          if (this.encrypted) {
            key = EncryptUtil.md5(key);
          }
          let str = sys.localStorage.getItem(key);
          if (null != str && '' !== str && this.encrypted && null != this._key && null != this._iv) {
            str = EncryptUtil.aesDecrypt(str, this._key, this._iv);
          }
          if (null === str) {
            return defaultValue;
          }
          return str;
        }

        /** 获取指定关键字的数值 */
        getNumber(key, defaultValue = 0) {
          var r = this.get(key);
          if (r == "0") {
            return Number(r);
          }
          return Number(r) || defaultValue;
        }

        /** 获取指定关键字的布尔值 */
        getBoolean(key) {
          var r = this.get(key);
          return Boolean(r) || false;
        }

        /** 获取指定关键字的JSON对象 */
        getJson(key, defaultValue) {
          var r = this.get(key);
          return r && JSON.parse(r) || defaultValue;
        }

        /**
         * 删除指定关键字的数据
         * @param key 需要移除的关键字
         * @returns 
         */
        remove(key) {
          if (null == key) {
            console.error("存储的key不能为空");
            return;
          }
          var keywords = this.getKey(key);
          if (this.encrypted) {
            keywords = EncryptUtil.md5(keywords);
          }
          sys.localStorage.removeItem(keywords);
        }

        /** 清空整个本地存储 */
        clear() {
          sys.localStorage.clear();
        }

        /** 获取数据分组关键字 */
        getKey(key) {
          if (this._id == null || this._id == "") {
            return key;
          }
          return `${this._id}_${key}`;
        }

        /** 数据加密开关 */
        get encrypted() {
          return !PREVIEW;
        }
      }
      exports('StorageManager', StorageManager);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/StringFormat.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "85fe8Gc6h5Ava+JsdbBs8cR", "StringFormat", undefined);
      /**
       * 数值格式化函数, 通过语义解析自动设置值的范围
       *     //整数
       * 1:def(0)//显示一个默认值
       */
      class StringFormat {
        deal(value, format) {
          if (format === '') return value;
          format = format.toLowerCase().trim(); // 不区分大小
          let match_func = format.match(/^[a-z|A-Z]+/gi); // 匹配到 format 中的 函数名
          let match_num = format.match(/\d+$/gi); //匹配到 format 中的参数
          let func = '';
          let num = 0;
          let res = '';
          if (match_func) func = match_func[0];
          if (match_num) num = parseInt(match_num[0]);
          if (typeof value == 'number') {
            switch (func) {
              case 'int':
                res = this.int(value);
                break;
              case 'fix':
                res = this.fix(value, num);
                break;
              case 'kmbt':
                res = this.KMBT(value);
                break;
              case 'per':
                res = this.per(value, num);
                break;
              case 'sep':
                res = this.sep(value);
                break;
            }
          } else {
            switch (func) {
              case 'limit':
                res = this.limit(value, num);
                break;
            }
            res = value;
          }
          return res;
        }

        // 将数字按分号显示
        sep(value) {
          let num = Math.round(value).toString();
          return num.replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");
        }

        // 将数字按分显示 00:00 显示 （ms制）
        time_m(value) {
          //todo
        }

        // 将数字按秒显示 00:00:00 显示 （ms制）
        time_s(value) {
          //todo
        }

        // 将数字按 0:00:00:000 显示 （ms制）
        time_ms(value) {
          //todo
        }

        // 将时间戳显示为详细的内容
        timeStamp(value) {
          //todo
          return new Date(value).toString();
        }

        /** [value:int] 将取值0~1 变成 1~100,可以指定修饰的小数位数 */
        per(value, fd) {
          return Math.round(value * 100).toFixed(fd);
        }

        /** [value:int] 将取值变成整数 */
        int(value) {
          return Math.round(value);
        }

        /** [value:fix2]数值转换为小数*/
        fix(value, fd) {
          return value.toFixed(fd);
        }

        /** [value:limit3]字符串长度限制 */
        limit(value, count) {
          return value.substring(0, count);
        }

        /** 将数字缩短显示为KMBT单位 大写,目前只支持英文 */
        KMBT(value, lang = 'en') {
          //10^4=万, 10^8=亿,10^12=兆,10^16=京，
          let counts = [1000, 1000000, 1000000000, 1000000000000];
          let units = ['', 'K', 'M', 'B', 'T'];
          return this.compressUnit(value, counts, units, 2);
        }

        //压缩任意单位的数字，后缀加上单位文字
        compressUnit(value, valueArr, unitArr, fixNum = 2) {
          let counts = valueArr;
          let units = unitArr;
          let res = "";
          let index;
          for (index = 0; index < counts.length; index++) {
            const e = counts[index];
            if (value < e) {
              if (index > 0) {
                res = (value / counts[index - 1]).toFixed(fixNum);
              } else {
                res = value.toFixed(0);
              }
              break;
            }
          }
          return res + units[index];
        }
      }

      /**格式化处理函数 */
      let StringFormatFunction = exports('StringFormatFunction', new StringFormat());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/StringUtil.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "aa8435LSBtAR5HPsje6IJ2w", "StringUtil", undefined);
      /** 字符串工具 */
      class StringUtil {
        /** 获取一个唯一标识的字符串 */
        static guid() {
          let guid = "";
          for (let i = 1; i <= 32; i++) {
            let n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if (i == 8 || i == 12 || i == 16 || i == 20) guid += "-";
          }
          return guid;
        }

        /**
         * 转美式计数字符串
         * @param value 数字
         * @example
         * 123456789 = 123,456,789
         */
        static numberTotPermil(value) {
          return value.toLocaleString();
        }

        /** 
         * 转英文单位计数
         * @param value 数字
         * @param fixed 保留小数位数
         * @example
         * 12345 = 12.35K
         */
        static numberToThousand(value, fixed = 2) {
          var k = 1000;
          var sizes = ['', 'K', 'M', 'G'];
          if (value < k) {
            return value.toString();
          } else {
            var i = Math.floor(Math.log(value) / Math.log(k));
            var r = value / Math.pow(k, i);
            return r.toFixed(fixed) + sizes[i];
          }
        }

        /** 
         * 转中文单位计数
         * @param value 数字
         * @param fixed 保留小数位数
         * @example
         * 12345 = 1.23万
         */
        static numberToTenThousand(value, fixed = 2) {
          var k = 10000;
          var sizes = ['', '万', '亿', '万亿'];
          if (value < k) {
            return value.toString();
          } else {
            var i = Math.floor(Math.log(value) / Math.log(k));
            return (value / Math.pow(k, i)).toFixed(fixed) + sizes[i];
          }
        }

        /**
         * 时间格式化
         * @param date  时间对象
         * @param fmt   格式化字符(yyyy-MM-dd hh:mm:ss S)
         */
        static format(date, fmt) {
          var o = {
            "M+": date.getMonth() + 1,
            // 月份 
            "d+": date.getDate(),
            // 日 
            "h+": date.getHours(),
            // 小时 
            "m+": date.getMinutes(),
            // 分 
            "s+": date.getSeconds(),
            // 秒 
            "q+": Math.floor((date.getMonth() + 3) / 3),
            // 季度 
            "S": date.getMilliseconds() // 毫秒 
          };

          if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
          }
          for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
              fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
          }
          return fmt;
        }

        /**
         * "," 分割字符串成数组
         * @param str 字符串
         */
        static stringToArray1(str) {
          if (str == "") {
            return [];
          }
          return str.split(",");
        }

        /** 
         * "|" 分割字符串成数组 
         * @param str 字符串
         */
        static stringToArray2(str) {
          if (str == "") {
            return [];
          }
          return str.split("|");
        }

        /** 
         * ":" 分割字符串成数组
         * @param str 字符串
         */
        static stringToArray3(str) {
          if (str == "") {
            return [];
          }
          return str.split(":");
        }

        /** 
         * ";" 分割字符串成数组 
         * @param str 字符串
         */
        static stringToArray4(str) {
          if (str == "") {
            return [];
          }
          return str.split(";");
        }

        /**
         * 字符串截取
         * @param str     字符串
         * @param n       截取长度
         * @param showdot 是否把截取的部分用省略号代替
         */
        static sub(str, n, showdot = false) {
          var r = /[^\x00-\xff]/g;
          if (str.replace(r, "mm").length <= n) {
            return str;
          }
          var m = Math.floor(n / 2);
          for (var i = m; i < str.length; i++) {
            if (str.substr(0, i).replace(r, "mm").length >= n) {
              if (showdot) {
                return str.substr(0, i) + "...";
              } else {
                return str.substr(0, i);
              }
            }
          }
          return str;
        }

        /**
         * 计算字符串长度，中文算两个字节
         * @param str 字符串
         */
        static stringLen(str) {
          var realLength = 0,
            len = str.length,
            charCode = -1;
          for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;else realLength += 2;
          }
          return realLength;
        }

        /**
         * 是否为空
         * @param str 
         */
        static IsEmpty(str) {
          if (str == null || str == undefined || str.length == 0) {
            return true;
          }
          return false;
        }

        /**
         * 参数替换
         * @param  str
         * @param  rest
         *  
         * @example
         *
         * var str:string = "here is some info '{0}' and {1}";
         * StringUtil.substitute(str, 15.4, true);
         *
         * "here is some info '15.4' and true"
         */
        static substitute(str, ...rest) {
          if (str == null) return '';
          var len = rest.length;
          var args;
          if (len == 1 && rest[0] instanceof Array) {
            args = rest[0];
            len = args.length;
          } else {
            args = rest;
          }
          for (var i = 0; i < len; i++) {
            str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
          }
          return str;
        }
      }
      exports('StringUtil', StringUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TableLanguage.ts", ['cc', './JsonUtil.ts'], function (exports) {
  var cclegacy, JsonUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      JsonUtil = module.JsonUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "290f6MwN4lHOKMkcDacqYvl", "TableLanguage", undefined);
      class TableLanguage {
        constructor() {
          this.data = void 0;
          /** 编号【KEY】 */
          this.id = 0;
        }
        init(id) {
          var table = JsonUtil.get(TableLanguage.TableName);
          this.data = table[id];
          this.id = id;
        }
        /** 简体中文 */
        get zh() {
          return this.data.zh;
        }
        /** 英文 */
        get en() {
          return this.data.en;
        }
      }
      exports('TableLanguage', TableLanguage);
      TableLanguage.TableName = "Language";
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TablePromptWindow.ts", ['cc', './JsonUtil.ts'], function (exports) {
  var cclegacy, JsonUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      JsonUtil = module.JsonUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "0e009G821ZKGIZpM03f9hNw", "TablePromptWindow", undefined);
      class TablePromptWindow {
        constructor() {
          this.data = void 0;
          /** 编号【KEY】 */
          this.id = 0;
          /** 双主键【KEY】 */
          this.id1 = 0;
          /** 双主键【KEY】 */
          this.id2 = 0;
        }
        init(id, id1, id2) {
          var table = JsonUtil.get(TablePromptWindow.TableName);
          this.data = table[id][id1][id2];
          this.id = id;
          this.id1 = id1;
          this.id2 = id2;
        }
        /** 标题 */
        get title() {
          return this.data.title;
        }
        /** 描述 */
        get describe() {
          return this.data.describe;
        }
        /** 描述 */
        get array() {
          return this.data.array;
        }
        /** 生命 */
        get hp() {
          return this.data.hp;
        }
      }
      exports('TablePromptWindow', TablePromptWindow);
      TablePromptWindow.TableName = "PromptWindow";
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TableRoleJob.ts", ['cc', './JsonUtil.ts'], function (exports) {
  var cclegacy, JsonUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      JsonUtil = module.JsonUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "45753Iz+QdB/ZUq9A1+MTlr", "TableRoleJob", undefined);
      class TableRoleJob {
        constructor() {
          this.data = void 0;
          /** 编号【KEY】 */
          this.id = 0;
        }
        init(id) {
          var table = JsonUtil.get(TableRoleJob.TableName);
          this.data = table[id];
          this.id = id;
        }
        /** 职业名 */
        get armsName() {
          return this.data.armsName;
        }
        /** 武器类型 */
        get weaponType() {
          return this.data.weaponType;
        }
        /** 力量 */
        get power() {
          return this.data.power;
        }
        /** 敏捷 */
        get agile() {
          return this.data.agile;
        }
      }
      exports('TableRoleJob', TableRoleJob);
      TableRoleJob.TableName = "RoleJob";
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TableRoleLevelUp.ts", ['cc', './JsonUtil.ts'], function (exports) {
  var cclegacy, JsonUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      JsonUtil = module.JsonUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f71b8qC0SlOVoCrFsC6HKio", "TableRoleLevelUp", undefined);
      class TableRoleLevelUp {
        constructor() {
          this.data = void 0;
          /** 编号【KEY】 */
          this.id = 0;
        }
        init(id) {
          var table = JsonUtil.get(TableRoleLevelUp.TableName);
          this.data = table[id];
          this.id = id;
        }
        /** 升级所需经验 */
        get needexp() {
          return this.data.needexp;
        }
        /** 升级增加生命 */
        get hp() {
          return this.data.hp;
        }
      }
      exports('TableRoleLevelUp', TableRoleLevelUp);
      TableRoleLevelUp.TableName = "RoleLevelUp";
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Task.ts", ['cc', './BTreeNode.ts'], function (exports) {
  var cclegacy, BTreeNode;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BTreeNode = module.BTreeNode;
    }],
    execute: function () {
      cclegacy._RF.push({}, "95087QhEU1G1LWnM2D7haTQ", "Task", undefined);

      /** 任务行为节点 */
      class Task extends BTreeNode {
        run(blackboard) {}
      }
      exports('Task', Task);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Timer.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "6021fct1uhJsImEuhdFWC0f", "Timer", undefined);
      /*
       * @Author: dgflash
       * @Date: 2023-01-19 11:09:38
       * @LastEditors: dgflash
       * @LastEditTime: 2023-01-19 14:28:05
       */

      /** 
       * 定时触发组件 
       * @example
          export class Test extends Component {
              // 创建一个定时跳动组件
              private timer: Timer = new Timer(1);
                update(dt: number) {
                  if (this.timer.update(this.dt)) {
                      console.log(每一秒触发一次);
                  }
              }
          }
       */
      class Timer {
        get elapsedTime() {
          return this._elapsedTime;
        }
        /** 触发间隔时间（秒） */
        get step() {
          return this._step;
        }
        set step(step) {
          this._step = step; // 每次修改时间
          this._elapsedTime = 0; // 逝去时间
        }

        get progress() {
          return this._elapsedTime / this._step;
        }

        /**
         * 定时触发组件
         * @param step  触发间隔时间（秒）
         */
        constructor(step = 0) {
          this.callback = null;
          this._elapsedTime = 0;
          this._step = -1;
          this.step = step;
        }
        update(dt) {
          if (this.step <= 0) return false;
          this._elapsedTime += dt;
          if (this._elapsedTime >= this._step) {
            var _this$callback;
            this._elapsedTime -= this._step;
            (_this$callback = this.callback) == null || _this$callback.call(this);
            return true;
          }
          return false;
        }
        reset() {
          this._elapsedTime = 0;
        }
        stop() {
          this._elapsedTime = 0;
          this.step = -1;
        }
      }
      exports('Timer', Timer);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TimerManager.ts", ['cc', './StringUtil.ts', './Timer.ts'], function (exports) {
  var cclegacy, Component, game, StringUtil, Timer;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      game = module.game;
    }, function (module) {
      StringUtil = module.StringUtil;
    }, function (module) {
      Timer = module.Timer;
    }],
    execute: function () {
      cclegacy._RF.push({}, "73600VLsIBLOKhOhd7td4P8", "TimerManager", undefined);

      /** 时间管理 */
      class TimerManager extends Component {
        constructor(...args) {
          super(...args);
          /** 倒计时数据 */
          this.times = {};
          /** 服务器时间 */
          this.date_s = new Date();
          /** 服务器初始时间 */
          this.date_s_start = new Date();
          /** 服务器时间后修正时间 */
          this.polymeric_s = 0;
          /** 客户端时间 */
          this.date_c = new Date();
        }
        /** 后台管理倒计时完成事件 */
        update(dt) {
          for (let key in this.times) {
            let data = this.times[key];
            var timer = data.timer;
            if (timer.update(dt)) {
              if (data.object[data.field] > 0) {
                data.object[data.field]--;

                // 倒计时结束触发
                if (data.object[data.field] == 0) {
                  this.onTimerComplete(data);
                }
                // 触发每秒回调事件  
                else if (data.onSecond) {
                  data.onSecond.call(data.object);
                }
              }
            }
          }
        }

        /** 触发倒计时完成事件 */
        onTimerComplete(data) {
          if (data.onComplete) data.onComplete.call(data.object);
          if (data.event) this.node.dispatchEvent(data.event);
          delete this.times[data.id];
        }

        /**
         * 在指定对象上注册一个倒计时的回调管理器
         * @param object        注册定时器的对象
         * @param field         时间字段
         * @param onSecond      每秒事件
         * @param onComplete    倒计时完成事件
         * @returns 
         * @example
        export class Test extends Component {
            private timeId!: string;
            
            start() {
                // 在指定对象上注册一个倒计时的回调管理器
                this.timeId = oops.timer.register(this, "countDown", this.onSecond, this.onComplete);
            }
            
            private onSecond() {
                console.log("每秒触发一次");
            }
              private onComplete() {
                console.log("倒计时完成触发");
            }
        }
         */
        register(object, field, onSecond, onComplete) {
          var timer = new Timer();
          timer.step = 1;
          let data = {};
          data.id = StringUtil.guid();
          data.timer = timer;
          data.object = object; // 管理对象
          data.field = field; // 时间字段
          data.onSecond = onSecond; // 每秒事件
          data.onComplete = onComplete; // 倒计时完成事件
          this.times[data.id] = data;
          return data.id;
        }

        /** 
         * 在指定对象上注销一个倒计时的回调管理器 
         * @param id         时间对象唯一表示
         * @example
        export class Test extends Component {
            private timeId!: string;
              start() {
                this.timeId = oops.timer.register(this, "countDown", this.onSecond, this.onComplete);
            }
              onDestroy() {
                // 在指定对象上注销一个倒计时的回调管理器
                oops.timer.unRegister(this.timeId);
            }
        }
         */
        unRegister(id) {
          if (this.times[id]) delete this.times[id];
        }

        /**
         * 服务器时间与本地时间同步
         * @param value   服务器时间刻度
         */
        setServerTime(value) {
          this.polymeric_s = this.getTime();
          this.date_s_start.setTime(value);
        }

        /** 获取写服务器同步的时间刻度 */
        getServerTime() {
          return this.date_s_start.getTime() + this.getTime() - this.polymeric_s;
        }

        /** 获取服务器时间对象 */
        getServerDate() {
          this.date_s.setTime(this.getServerTime());
          return this.date_s;
        }

        /** 获取本地时间刻度 */
        getClientTime() {
          return Date.now();
        }

        /** 获取本地时间对象 */
        getClientDate() {
          this.date_c.setTime(this.getClientTime());
          return this.date_c;
        }

        /** 获取游戏开始到现在逝去的时间 */
        getTime() {
          return game.totalTime;
        }

        /** 游戏最小化时记录时间数据 */
        save() {
          for (let key in this.times) {
            this.times[key].startTime = this.getTime();
          }
        }

        /** 游戏最大化时回复时间数据 */
        load() {
          for (let key in this.times) {
            let interval = Math.floor((this.getTime() - (this.times[key].startTime || this.getTime())) / 1000);
            let data = this.times[key];
            data.object[data.field] = data.object[data.field] - interval;
            if (data.object[data.field] <= 0) {
              data.object[data.field] = 0;
              this.onTimerComplete(data);
            } else {
              this.times[key].startTime = null;
            }
          }
        }
      }
      exports('TimerManager', TimerManager);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TimeUtils.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c2070jsq0FDcaTrFhyA8yzm", "TimeUtils", undefined);
      /** 时间工具 */
      class TimeUtil {
        /** 间隔天数 */
        static daysBetween(time1, time2) {
          if (time2 == undefined || time2 == null) {
            time2 = +new Date();
          }
          let startDate = new Date(time1).toLocaleDateString();
          let endDate = new Date(time2).toLocaleDateString();
          let startTime = new Date(startDate).getTime();
          let endTime = new Date(endDate).getTime();
          let dates = Math.abs(startTime - endTime) / (1000 * 60 * 60 * 24);
          return dates;
        }

        /** 间隔秒数 */
        static secsBetween(time1, time2) {
          if (time2 == undefined || time2 == null) {
            time2 = +new Date();
          }
          let dates = Math.abs(time2 - time1) / 1000;
          return dates;
        }

        /**
         * 代码休眠时间
         * @param ms 毫秒
         */
        static async sleep(ms) {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      }
      exports('TimeUtil', TimeUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TipsManager.ts", ['cc', './Oops.ts', './GameUIConfig.ts'], function (exports) {
  var cclegacy, tween, Vec3, oops, UIID;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      tween = module.tween;
      Vec3 = module.Vec3;
    }, function (module) {
      oops = module.oops;
    }, function (module) {
      UIID = module.UIID;
    }],
    execute: function () {
      cclegacy._RF.push({}, "9748eriEcJOp6OSdnZ/qhs5", "TipsManager", undefined);

      /** 提示窗口管理 */
      class TipsManager {
        test(callback) {
          let operate = {
            title: 'common_prompt_title_sys',
            content: "common_prompt_content",
            okWord: 'common_prompt_ok',
            cancelWord: 'common_prompt_cancal',
            okFunc: () => {
              console.log("okFunc");
            },
            cancelFunc: () => {
              console.log("cancelFunc");
            },
            needCancel: true
          };
          oops.gui.open(UIID.Window, operate, this.getPopCommonEffect());
        }
        alert(content, cb, title, okWord) {
          let operate = {
            title: title ? title : 'common_prompt_title_sys',
            content: content,
            okWord: okWord ? okWord : 'common_prompt_ok',
            okFunc: () => {
              cb && cb();
            },
            needCancel: false
          };
          oops.gui.open(UIID.Window, operate, tips.getPopCommonEffect());
        }
        confirm(content, cb, okWord = "common_prompt_ok") {
          let operate = {
            title: 'common_prompt_title_sys',
            content: content,
            okWord: okWord,
            cancelWord: 'common_prompt_cancal',
            okFunc: () => {
              cb && cb();
            },
            cancelFunc: () => {},
            needCancel: true
          };
          oops.gui.open(UIID.Window, operate, tips.getPopCommonEffect());
        }

        /** 弹窗动画 */
        getPopCommonEffect(callbacks) {
          let newCallbacks = {
            // 节点添加动画
            onAdded: (node, params) => {
              node.setScale(0.1, 0.1, 0.1);
              tween(node).to(0.2, {
                scale: new Vec3(1, 1, 1)
              }).start();
            },
            // 节点删除动画
            onBeforeRemove: (node, next) => {
              tween(node).to(0.2, {
                scale: new Vec3(0.1, 0.1, 0.1)
              }).call(next).start();
            }
          };
          if (callbacks) {
            if (callbacks && callbacks.onAdded) {
              let onAdded = callbacks.onAdded;
              // @ts-ignore
              callbacks.onAdded = (node, params) => {
                onAdded(node, params);

                // @ts-ignore
                newCallbacks.onAdded(node, params);
              };
            }
            if (callbacks && callbacks.onBeforeRemove) {
              let onBeforeRemove = callbacks.onBeforeRemove;
              callbacks.onBeforeRemove = (node, params) => {
                onBeforeRemove(node, params);

                // @ts-ignore
                newCallbacks.onBeforeRemove(node, params);
              };
            }
            return callbacks;
          }
          return newCallbacks;
        }
      }
      var tips = exports('tips', new TipsManager());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UIMap.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1bd03ggtItIIajoqd0I4VGL", "UIMap", undefined);
      /*
       * @Author: dgflash
       * @Date: 2022-06-14 19:35:16
       * @LastEditors: dgflash
       * @LastEditTime: 2022-09-02 13:27:20
       */
      /** 界面关系树节点 */
      class TreeNode {
        constructor() {
          this.id = void 0;
          /** 父节点编号 */
          this.pid = void 0;
          /** 父节点 */
          this.parent = null;
          /** 子节点 */
          this.child = [];
          /** 界面名 */
          this.name = void 0;
          /** 界面代号（用于同一界面有多条路径时） */
          this.panel = void 0;
        }
      }

      /** 用于树形结构两节点之间的寻路功能 */
      class UIMap {
        constructor() {
          /** UI层级管理器 */
          this.manager = void 0;
          /** 界面节点树 */
          this.nodes = new Map();
        }
        /** 创建UI关系树 */
        init(manager, data) {
          this.manager = manager;

          // 解析数据
          for (var key in data) {
            var d = data[key];
            var n = new TreeNode();
            n.id = parseInt(key);
            n.pid = d.parent;
            n.name = d.name;
            n.panel = d.panel;
            this.nodes.set(n.id, n);
          }

          // 设置节点关系
          this.nodes.forEach((value, key) => {
            value.parent = this.nodes.get(value.pid);
            if (value.parent) value.parent.child.push(value);
          });
        }

        /**
         * 树节点寻路
         * @param startId 起始节点编号
         * @param endId   结束节点编号
         * @returns 
         */
        pathFinding(startId, endId) {
          var start = this.nodes.get(startId);
          var end = this.nodes.get(endId);
          var close = this.findUp(start);
          var open = this.findUp(end);
          close.forEach(value => {
            this.manager.remove(value.id, true);
          });
          open.forEach(value => {
            this.manager.open(value.id);
          });
          return {
            paths_close: close,
            paths_open: open
          };
        }

        /** 向上寻找子节点直到根节点停止，并返回节点路径数组 */
        findUp(start) {
          var paths = [];
          var current = start;
          while (current.parent != null) {
            // 父级为空时为根节点
            paths.push(current);
            current = current.parent;
          }
          return paths;
        }

        /** 释放所有节点 */
        release() {
          this.nodes.clear();
        }
      }
      exports('UIMap', UIMap);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Vec3Util.ts", ['cc', './MathUtil.ts'], function (exports) {
  var cclegacy, Vec3, Mat4, MathUtil;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      Mat4 = module.Mat4;
    }, function (module) {
      MathUtil = module.MathUtil;
    }],
    execute: function () {
      cclegacy._RF.push({}, "38947ih8d5EQ7HG4buug+SR", "Vec3Util", undefined);

      /** 向量工具 */
      class Vec3Util {
        /**
         * X轴
         */
        static get x() {
          return new Vec3(1, 0, 0);
        }

        /**
         * Y轴
         */
        static get y() {
          return new Vec3(0, 1, 0);
        }

        /**
         * Z轴
         */
        static get z() {
          return new Vec3(0, 0, 1);
        }

        /**
         * 左向量
         */
        static get left() {
          return new Vec3(-1, 0, 0);
        }

        /**
         * 右向量
         */
        static get right() {
          return new Vec3(1, 0, 0);
        }

        /**
         * 上向量
         */
        static get up() {
          return new Vec3(0, 1, 0);
        }

        /**
         * 下向量
         */
        static get down() {
          return new Vec3(0, -1, 0);
        }

        /**
         * 前向量
         */
        static get forward() {
          return new Vec3(0, 0, 1);
        }

        /**
         * 后向量
         */
        static get back() {
          return new Vec3(0, 0, -1);
        }

        /**
         * 1向量
         */
        static get one() {
          return new Vec3(1, 1, 1);
        }

        /**
         * 0向量
         */
        static get zero() {
          return new Vec3(0, 0, 0);
        }

        /**
         * 随时间变化进度值
         * @param start  起始位置
         * @param end    结束位置
         * @param t      进度[0，1]
         */
        static progress(start, end, t) {
          var current = new Vec3();
          current.x = MathUtil.progress(start.x, end.x, t);
          current.y = MathUtil.progress(start.y, end.y, t);
          current.z = MathUtil.progress(start.z, end.z, t);
          return current;
        }

        /**
         * 求两个三维向量的和
         * @param pos1  向量1
         * @param pos2  向量2
         */
        static add(pos1, pos2) {
          var outPos = new Vec3();
          Vec3.add(outPos, pos1, pos2);
          return outPos;
        }

        /**
         * 求两个三维向量的差
         * @param pos1  向量1
         * @param pos2  向量2
         */
        static sub(pos1, pos2) {
          var outPos = new Vec3();
          Vec3.subtract(outPos, pos1, pos2);
          return outPos;
        }

        /**
         * 三维向量乘以常量
         * @param pos     向量
         * @param scalar  常量
         */
        static mul(pos, scalar) {
          var outPos = new Vec3();
          Vec3.multiplyScalar(outPos, pos, scalar);
          return outPos;
        }

        /**
         * 三维向量除常量
         * @param pos     向量
         * @param scalar  常量
         */
        static div(pos, scalar) {
          var outPos = new Vec3();
          outPos.x = pos.x / scalar;
          outPos.y = pos.y / scalar;
          outPos.z = pos.z / scalar;
          return outPos;
        }

        /**
         * 判断两个三维向量的值是否相等
         * @param pos1  向量1
         * @param pos2  向量2
         */
        static equals(pos1, pos2) {
          if (pos1.x == pos2.x && pos1.y == pos2.y && pos1.z == pos2.z) {
            return true;
          }
          return false;
        }

        /**
         * 三维向量的模
         * @param pos  向量
         */
        static magnitude(pos) {
          return pos.length();
        }

        /**
         * 三维向量归一化
         * @param pos  向量
         */
        static normalize(pos) {
          var outPos = new Vec3(pos.x, pos.y, pos.z);
          return outPos.normalize();
        }

        /**
         * 获得位置1，到位置2的方向
         * @param pos1  向量1
         * @param pos2  向量2
         */
        static direction(pos1, pos2) {
          var outPos = new Vec3();
          Vec3.subtract(outPos, pos2, pos1);
          return outPos.normalize();
        }

        /**
         * 获得两点间的距离
         * @param pos1  向量1
         * @param pos2  向量2
         */
        static distance(pos1, pos2) {
          return Vec3.distance(pos1, pos2);
        }

        /**
         * 插值运算
         * @param posStart  开始俏步
         * @param posEnd    结束位置
         * @param t         时间
         */
        static lerp(posStart, posEnd, t) {
          return this.bezierOne(t, posStart, posEnd);
        }

        /**
         * 球面插值
         * @param from  起点
         * @param to    终点
         * @param t     时间
         */
        static slerp(from, to, t) {
          if (t <= 0) {
            return from;
          } else if (t >= 1) {
            return to;
          }
          var dir = this.rotateTo(from, to, Vec3.angle(from, to) / Math.PI * 180 * t);
          var lenght = to.length() * t + from.length() * (1 - t);
          return dir.normalize().multiplyScalar(lenght);
        }

        /**
         * 向量旋转一个角度
         * @param from  起点
         * @param to    终点
         * @param angle 角并
         */
        static rotateTo(from, to, angle) {
          //如果两个方向角度为0，则返回目标
          if (Vec3.angle(from, to) == 0) {
            return to;
          }
          var axis = new Vec3(); // 获得旋转轴
          Vec3.cross(axis, from, to);
          axis.normalize();
          var radian = angle * Math.PI / 180; // 获得弧度
          var rotateMatrix = new Mat4();
          rotateMatrix.rotate(radian, axis);
          return new Vec3(from.x * rotateMatrix.m00 + from.y * rotateMatrix.m04 + from.z * rotateMatrix.m08, from.x * rotateMatrix.m01 + from.y * rotateMatrix.m05 + from.z * rotateMatrix.m09, from.x * rotateMatrix.m02 + from.y * rotateMatrix.m06 + from.z * rotateMatrix.m10);
        }

        /**
         * 一次贝塞尔即为线性插值函数
         * @param t 
         * @param posStart 
         * @param posEnd 
         * @returns 
         */
        static bezierOne(t, posStart, posEnd) {
          if (t > 1) {
            t = 1;
          } else if (t < 0) {
            t = 0;
          }
          var pStart = posStart.clone();
          var pEnd = posEnd.clone();
          return pStart.multiplyScalar(1 - t).add(pEnd.multiplyScalar(t));
        }

        /**
         * 二次贝塞尔曲线
         * @param t 
         * @param posStart 
         * @param posCon 
         * @param posEnd 
         * @returns 
         */
        static bezierTwo(t, posStart, posCon, posEnd) {
          if (t > 1) {
            t = 1;
          } else if (t < 0) {
            t = 0;
          }
          var n = 1 - t;
          var tt = t * t;
          var pStart = posStart.clone();
          var pos = new Vec3();
          var pCon = posCon.clone();
          var pEnd = posEnd.clone();
          pos.add(pStart.multiplyScalar(n * n));
          pos.add(pCon.multiplyScalar(2 * n * t));
          pos.add(pEnd.multiplyScalar(tt));
          return pos;
        }

        /**
         * 三次贝塞尔
         * @param t 
         * @param posStart 
         * @param posCon1 
         * @param posCon2 
         * @param posEnd 
         * @returns 
         */
        static bezierThree(t, posStart, posCon1, posCon2, posEnd) {
          if (t > 1) {
            t = 1;
          } else if (t < 0) {
            t = 0;
          }
          var n = 1 - t;
          var nn = n * n;
          var nnn = nn * n;
          var tt = t * t;
          var ttt = tt * t;
          var pStart = posStart.clone();
          var pos = posStart.clone();
          var pCon1 = posCon1.clone();
          var pCon2 = posCon2.clone();
          var pEnd = posEnd.clone();
          pos.add(pStart.multiplyScalar(nnn));
          pos.add(pCon1.multiplyScalar(3 * nn * t));
          pos.add(pCon2.multiplyScalar(3 * n * tt));
          pos.add(pEnd.multiplyScalar(ttt));
          return pos;
        }

        /**
         * 点乘
         * @param dir1 方向量1
         * @param dir2 方向量2
         */
        static dot(dir1, dir2) {
          var tempDir1 = dir1;
          var tempDir2 = dir2;
          return tempDir1.x * tempDir2.x + tempDir1.y * tempDir2.y + tempDir1.z * tempDir2.z;
        }

        /**
         * 叉乘
         * @param dir1 方向量1
         * @param dir2 方向量2
         */
        static cross(dir1, dir2) {
          var i = new Vec3(1, 0, 0);
          var j = new Vec3(0, 1, 0);
          var k = new Vec3(0, 0, 1);
          var tempDir1 = new Vec3(dir1.x, dir1.y, dir1.z);
          var tempDir2 = new Vec3(dir2.x, dir2.y, dir2.z);
          var iv = i.multiplyScalar(tempDir1.y * tempDir2.z - tempDir2.y * tempDir1.z);
          var jv = j.multiplyScalar(tempDir2.x * tempDir1.z - tempDir1.x * tempDir2.z);
          var kv = k.multiplyScalar(tempDir1.x * tempDir2.y - tempDir2.x * tempDir1.y);
          return iv.add(jv).add(kv);
        }

        /**
         * 获得两个方向向量的角度
         * @param dir1 方向量1
         * @param dir2 方向量2
         */
        static angle(dir1, dir2) {
          var dotValue = this.dot(dir1.clone().normalize(), dir2.clone().normalize());
          return Math.acos(dotValue) / Math.PI * 180 * Math.sign(dotValue);
        }

        /**
         * 获得方向a到方向b的角度（带有方向的角度）
         * @param a 角度a
         * @param b 角度b
         */
        static dirAngle(a, b) {
          var c = Vec3Util.cross(a, b);
          var angle = Vec3Util.angle(a, b);
          // a 到 b 的夹角
          var sign = Math.sign(Vec3Util.dot(c.normalize(), Vec3Util.cross(b.normalize(), a.normalize())));
          return angle * sign;
        }
      }
      exports('Vec3Util', Vec3Util);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ViewModel.ts", ['cc', './JsonOb.ts'], function (exports) {
  var cclegacy, director, JsonOb;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
    }, function (module) {
      JsonOb = module.JsonOb;
    }],
    execute: function () {
      cclegacy._RF.push({}, "54f75k4X+RP0qaXOzrfZysL", "ViewModel", undefined);
      const VM_EMIT_HEAD = 'VC:';

      /** 通过 .  路径设置值 */
      function setValueFromPath(obj, path, value, tag = '') {
        let props = path.split('.');
        for (let i = 0; i < props.length; i++) {
          const propName = props[i];
          if (propName in obj === false) {
            console.error('[' + propName + '] not find in ' + tag + '.' + path);
            break;
          }
          if (i == props.length - 1) {
            obj[propName] = value;
          } else {
            obj = obj[propName];
          }
        }
      }

      /** 通过 . 路径 获取值 */
      function getValueFromPath(obj, path, def, tag = '') {
        let props = path.split('.');
        for (let i = 0; i < props.length; i++) {
          const propName = props[i];
          if (propName in obj === false) {
            console.error('[' + propName + '] not find in ' + tag + '.' + path);
            return def;
          }
          obj = obj[propName];
        }
        if (obj === null || typeof obj === "undefined") obj = def; //如果g == null 则返回一个默认值
        return obj;
      }

      /**
       * ModelViewer 类
       */
      class ViewModel {
        constructor(data, tag) {
          this.$data = void 0;
          // 索引值用的标签
          this._tag = null;
          /** 激活状态, 将会通过 director.emit 发送值变动的信号, 适合需要屏蔽的情况 */
          this.active = true;
          /** 是否激活根路径回调通知, 不激活的情况下 只能监听末端路径值来判断是否变化 */
          this.emitToRootPath = false;
          new JsonOb(data, this._callback.bind(this));
          this.$data = data;
          this._tag = tag;
        }
        // 回调函数 请注意 回调的 path 数组是 引用类型，禁止修改
        _callback(n, o, path) {
          if (this.active == true) {
            let name = VM_EMIT_HEAD + this._tag + '.' + path.join('.');
            director.emit(name, n, o, [this._tag].concat(path)); // 通知末端路径

            if (this.emitToRootPath) director.emit(VM_EMIT_HEAD + this._tag, n, o, path); // 通知主路径

            if (path.length >= 2) {
              for (let i = 0; i < path.length - 1; i++) {
                const e = path[i];
                //log('中端路径');
              }
            }
          }
        }

        // 通过路径设置数据的方法
        setValue(path, value) {
          setValueFromPath(this.$data, path, value, this._tag);
        }

        // 获取路径的值
        getValue(path, def) {
          return getValueFromPath(this.$data, path, def, this._tag);
        }
      }

      /**
       * VM 对象管理器(工厂)
       */
      class VMManager {
        constructor() {
          this._mvs = new Map();
          this.setObjValue = setValueFromPath;
          this.getObjValue = getValueFromPath;
        }
        /**
         * 绑定一个数据，并且可以由VM所管理（绑定的数据只能是值类型）
         * @param data 需要绑定的数据
         * @param tag 对应该数据的标签(用于识别为哪个VM，不允许重复)
         * @param activeRootObject 激活主路径通知，可能会有性能影响，一般不使用
         */
        add(data, tag = 'global', activeRootObject = false) {
          let vm = new ViewModel(data, tag);
          let has = this._mvs.get(tag);
          if (tag.includes('.')) {
            console.error('cant write . in tag:', tag);
            return;
          }
          if (has) {
            console.error('already set VM tag:' + tag);
            return;
          }
          vm.emitToRootPath = activeRootObject;
          this._mvs.set(tag, vm);
        }

        /**
         * 移除并且销毁 VM 对象
         * @param tag 
         */
        remove(tag) {
          this._mvs.delete(tag);
        }

        /**
         * 获取绑定的数据
         * @param tag 数据tag
         */
        get(tag) {
          let res = this._mvs.get(tag);
          return res;
        }

        /**
         * 通过全局路径,而不是 VM 对象来 设置值
         * @param path - 全局取值路径
         * @param value - 需要增加的值
         */
        addValue(path, value) {
          path = path.trim(); //防止空格,自动剔除
          let rs = path.split('.');
          if (rs.length < 2) {
            console.error('Cant find path:' + path);
          }
          let vm = this.get(rs[0]);
          if (!vm) {
            console.error('Cant Set VM:' + rs[0]);
            return;
          }
          let resPath = rs.slice(1).join('.');
          vm.setValue(resPath, vm.getValue(resPath) + value);
        }

        /**
         * 通过全局路径,而不是 VM 对象来 获取值
         * @param path - 全局取值路径
         * @param def - 如果取不到值的返回的默认值
         */
        getValue(path, def) {
          path = path.trim(); // 防止空格,自动剔除
          let rs = path.split('.');
          if (rs.length < 2) {
            console.error('Get Value Cant find path:' + path);
            return;
          }
          let vm = this.get(rs[0]);
          if (!vm) {
            console.error('Cant Get VM:' + rs[0]);
            return;
          }
          return vm.getValue(rs.slice(1).join('.'), def);
        }

        /**
         * 通过全局路径,而不是 VM 对象来 设置值
         * @param path - 全局取值路径
         * @param value - 需要设置的值
         */
        setValue(path, value) {
          path = path.trim(); // 防止空格,自动剔除
          let rs = path.split('.');
          if (rs.length < 2) {
            console.error('Set Value Cant find path:' + path);
            return;
          }
          let vm = this.get(rs[0]);
          if (!vm) {
            console.error('Cant Set VM:' + rs[0]);
            return;
          }
          vm.setValue(rs.slice(1).join('.'), value);
        }
        /** 等同于 director.on */
        bindPath(path, callback, target, useCapture) {
          path = path.trim(); // 防止空格,自动剔除
          if (path == '') {
            console.error(target.node.name, '节点绑定的路径为空');
            return;
          }
          if (path.split('.')[0] === '*') {
            console.error(path, '路径不合法,可能错误覆盖了 VMParent 的onLoad 方法, 或者父节点并未挂载 VMParent 相关的组件脚本');
            return;
          }
          // @ts-ignore
          director.on(VM_EMIT_HEAD + path, callback, target, useCapture);
        }

        /** 等同于 director.off */
        unbindPath(path, callback, target) {
          path = path.trim(); //防止空格,自动剔除
          if (path.split('.')[0] === '*') {
            console.error(path, '路径不合法,可能错误覆盖了 VMParent 的onLoad 方法, 或者父节点并未挂载 VMParent 相关的组件脚本');
            return;
          }
          // @ts-ignore
          director.off(VM_EMIT_HEAD + path, callback, target);
        }

        /** 冻结所有标签的 VM，视图将不会受到任何信息 */
        inactive() {
          this._mvs.forEach(mv => {
            mv.active = false;
          });
        }

        /** 激活所有标签的 VM*/
        active() {
          this._mvs.forEach(mv => {
            mv.active = false;
          });
        }
      }

      //   整数、小数、时间、缩写

      /**
       *  VM管理对象,使用文档: 
       *  https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/ViewModelScript.md
       */
      let VM = exports('VM', new VMManager());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ViewUtil.ts", ['cc', './Oops.ts'], function (exports) {
  var cclegacy, UITransform, v3, Size, Prefab, instantiate, Animation, AnimationClip, oops;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      UITransform = module.UITransform;
      v3 = module.v3;
      Size = module.Size;
      Prefab = module.Prefab;
      instantiate = module.instantiate;
      Animation = module.Animation;
      AnimationClip = module.AnimationClip;
    }, function (module) {
      oops = module.oops;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f607cCjAEZHVKVZ/FyRs5bA", "ViewUtil", undefined);

      /** 显示对象工具 */
      class ViewUtil {
        /**
         * 把Node当前的节点树结构根据Node命名转成一个js对象,重名的组件会覆盖，
         * Node的name不应该包含空格键，否则将跳过
         * @param parent 被遍历的Node组件
         * @param obj    绑定的js对象 (可选)
         */
        static nodeTreeInfoLite(parent, obj) {
          let map = obj || new Map();
          let items = parent.children;
          for (let i = 0; i < items.length; i++) {
            let _node = items[i];
            if (_node.name.indexOf(" ") < 0) {
              map.set(_node.name, _node);
            }
            ViewUtil.nodeTreeInfoLite(_node, map);
          }
          return map;
        }

        /**
         * 正则搜索节点名字,符合条件的节点将会返回
         * @param reg     正则表达式
         * @param parent  要搜索的父节点
         * @param nodes   返回的数组（可选）
         */
        static findNodes(reg, parent, nodes) {
          let ns = nodes || [];
          let items = parent.children;
          for (let i = 0; i < items.length; i++) {
            let _name = items[i].name;
            if (reg.test(_name)) {
              ns.push(items[i]);
            }
            ViewUtil.findNodes(reg, items[i], ns);
          }
          return ns;
        }
        /**
         * 节点之间坐标互转
         * @param a         A节点
         * @param b         B节点
         * @param aPos      A节点空间中的相对位置
         */
        static calculateASpaceToBSpacePos(a, b, aPos) {
          var world = a.getComponent(UITransform).convertToWorldSpaceAR(aPos);
          var space = b.getComponent(UITransform).convertToNodeSpaceAR(world);
          return space;
        }

        /**
         * 屏幕转空间坐标
         * @param event 触摸事件
         * @param space 转到此节点的坐标空间
         */
        static calculateScreenPosToSpacePos(event, space) {
          let uil = event.getUILocation();
          let worldPos = v3(uil.x, uil.y);
          let mapPos = space.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
          return mapPos;
        }

        /**
         * 显示对象等比缩放
         * @param targetWidth       目标宽
         * @param targetHeight      目标高
         * @param defaultWidth      默认宽
         * @param defaultHeight     默认高
         */
        static uniformScale(targetWidth, targetHeight, defaultWidth, defaultHeight) {
          var widthRatio = defaultWidth / targetWidth;
          var heightRatio = defaultHeight / targetHeight;
          var ratio;
          widthRatio < heightRatio ? ratio = widthRatio : ratio = heightRatio;
          var size = new Size(Math.floor(targetWidth * ratio), Math.floor(targetHeight * ratio));
          return size;
        }

        /**
         * 从资源缓存中找到预制资源名并创建一个显示对象
         * @param path 资源路径
         */
        static createPrefabNode(path) {
          var p = oops.res.get(path, Prefab);
          var n = instantiate(p);
          return n;
        }

        /**
         * 加载预制并创建预制节点
         * @param path 资源路径
         */
        static createPrefabNodeAsync(path) {
          return new Promise(async (resolve, reject) => {
            oops.res.load(path, Prefab, (err, content) => {
              if (err) {
                console.error(`名为【${path}】的资源加载失败`);
                return;
              }
              var node = this.createPrefabNode(path);
              resolve(node);
            });
          });
        }

        /**
         * 加载预制节点
         * @param path          资源路径
         * @param callback      资源加载完成回调
         */
        static loadPrefabNode(path, callback) {
          oops.res.load(path, Prefab, (err, content) => {
            if (err) {
              console.error(`名为【${path}】的资源加载失败`);
              return;
            }
            var node = this.createPrefabNode(path);
            callback(node);
          });
        }

        /**
         * 添加节点动画
         * @param path              资源路径
         * @param node              目标节点
         * @param onlyOne           是否唯一
         * @param isDefaultClip     是否播放默认动画剪辑
         */
        static addNodeAnimation(path, node, onlyOne = true, isDefaultClip = false) {
          if (!node || !node.isValid) {
            return;
          }
          var anim = node.getComponent(Animation);
          if (anim == null) {
            anim = node.addComponent(Animation);
          }
          var clip = oops.res.get(path, AnimationClip);
          if (!clip) {
            return;
          }
          if (onlyOne && anim.getState(clip.name) && anim.getState(clip.name).isPlaying) {
            return;
          }
          if (isDefaultClip) {
            anim.defaultClip = clip;
            anim.play();
            return;
          }

          // 播放完成后恢复播放默认动画
          anim.once(Animation.EventType.FINISHED, () => {
            if (anim.defaultClip) {
              anim.play();
            }
          }, this);
          if (anim.getState(clip.name)) {
            anim.play(clip.name);
            return;
          }
          anim.createState(clip, clip.name);
          anim.play(clip.name);
        }
      }
      exports('ViewUtil', ViewUtil);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/VMBase.ts", ['cc', './ViewModel.ts', './VMEnv.ts'], function (exports) {
  var cclegacy, Component, log, _decorator, VM, VMEnv;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      log = module.log;
      _decorator = module._decorator;
    }, function (module) {
      VM = module.VM;
    }, function (module) {
      VMEnv = module.VMEnv;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "2f6f36IvUdPO7xynnVTPgzb", "VMBase", undefined);
      const {
        ccclass,
        help
      } = _decorator;

      /**
       * watchPath 的基础，只提供绑定功能 和 对应的数据更新函数
       */
      let VMBase = exports('VMBase', (_dec = help('https://gitee.com/dgflash/oops-framework/blob/master/doc/mvvm/VMBase.md'), ccclass(_class = _dec(_class = class VMBase extends Component {
        constructor(...args) {
          super(...args);
          /**VM管理 */
          this.VM = VM;
          /** watch 单路径  */
          this.watchPath = '';
          /** 是否启用模板多路径模式 */
          this.templateMode = false;
          /** watch 多路径 */
          this.watchPathArr = [];
          /** 储存模板多路径的值 */
          this.templateValueArr = [];
        }
        /**
         * 如果需要重写onLoad 方法，请根据顺序调用 super.onLoad()，执行默认方法
         */
        onLoad() {
          if (VMEnv.editor) return;

          // 提前拆分、并且解析路径
          let paths = this.watchPath.split('.');
          for (let i = 1; i < paths.length; i++) {
            const p = paths[i];
            // 如果发现了路径使用了 * ，则自动去自己的父节点查找自己所在 index 值
            if (p == '*') {
              let index = this.node.parent.children.findIndex(n => n === this.node);
              if (index <= 0) index = 0;
              paths[i] = index.toString();
              break;
            }
          }

          // 替换掉原路径
          this.watchPath = paths.join('.');

          // 提前进行路径数组 的 解析
          let pathArr = this.watchPathArr;
          if (pathArr.length >= 1) {
            for (let i = 0; i < pathArr.length; i++) {
              const path = pathArr[i];
              let paths = path.split('.');
              for (let i = 1; i < paths.length; i++) {
                const p = paths[i];
                if (p == '*') {
                  let index = this.node.parent.children.findIndex(n => n === this.node);
                  if (index <= 0) index = 0;
                  paths[i] = index.toString();
                  break;
                }
              }
              this.watchPathArr[i] = paths.join('.');
            }
          }
          if (this.watchPath == '' && this.watchPathArr.join('') == '') {
            log('可能未设置路径的节点:', this.node.parent.name + '.' + this.node.name);
          }
        }
        onEnable() {
          if (VMEnv.editor) return;
          if (this.templateMode) {
            this.setMultPathEvent(true);
          } else if (this.watchPath != '') {
            this.VM.bindPath(this.watchPath, this.onValueChanged, this);
          }
          this.onValueInit(); // 激活时,调用值初始化
        }

        onDisable() {
          if (VMEnv.editor) return;
          if (this.templateMode) {
            this.setMultPathEvent(false);
          } else if (this.watchPath != '') {
            this.VM.unbindPath(this.watchPath, this.onValueChanged, this);
          }
        }

        // 多路径监听方式
        setMultPathEvent(enabled = true) {
          if (VMEnv.editor) return;
          let arr = this.watchPathArr;
          for (let i = 0; i < arr.length; i++) {
            const path = arr[i];
            if (enabled) {
              this.VM.bindPath(path, this.onValueChanged, this);
            } else {
              this.VM.unbindPath(path, this.onValueChanged, this);
            }
          }
        }
        onValueInit() {
          // 虚方法
        }

        /**
         * 值变化事件
         * @param n       新值
         * @param o       旧值
         * @param pathArr 对象路径数组
         */
        onValueChanged(n, o, pathArr) {}
      }) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/VMCompsEdit.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './VMEnv.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, CCString, Enum, Node, _decorator, Component, log, VMEnv;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      CCString = module.CCString;
      Enum = module.Enum;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      log = module.log;
    }, function (module) {
      VMEnv = module.VMEnv;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;
      cclegacy._RF.push({}, "2359eFXKF5HFYS74K7Y17/U", "VMCompsEdit", undefined);
      const {
        ccclass,
        property,
        executeInEditMode,
        menu,
        help
      } = _decorator;
      var ACTION_MODE = /*#__PURE__*/function (ACTION_MODE) {
        ACTION_MODE[ACTION_MODE["SEARCH_COMPONENT"] = 0] = "SEARCH_COMPONENT";
        ACTION_MODE[ACTION_MODE["ENABLE_COMPONENT"] = 1] = "ENABLE_COMPONENT";
        ACTION_MODE[ACTION_MODE["REPLACE_WATCH_PATH"] = 2] = "REPLACE_WATCH_PATH";
        ACTION_MODE[ACTION_MODE["DELETE_COMPONENT"] = 3] = "DELETE_COMPONENT";
        return ACTION_MODE;
      }(ACTION_MODE || {});
      /**
       * 用于搜索的MV 组件列表，挂载在父节点后，
       * 会遍历搜索下面的所有MV组件, 并且显示其观察值的路径
       */
      let MVCompsEdit = exports('default', (_dec = menu('ModelViewer/Edit-Comps (快速组件操作)'), _dec2 = help('https://gitee.com/dgflash/oops-framework/blob/master/doc/mvvm/VMCompsEdit.md'), _dec3 = property({
        type: [CCString]
      }), _dec4 = property({
        type: Enum(ACTION_MODE)
      }), _dec5 = property({
        tooltip: '勾选后,会自动查找 find list 中填写的组件',
        visible: function () {
          // @ts-ignore
          return this.actionType === ACTION_MODE.SEARCH_COMPONENT;
        }
      }), _dec6 = property({
        tooltip: '勾选后,会批量激活 find list 中填写的组件',
        visible: function () {
          // @ts-ignore
          return this.actionType === ACTION_MODE.ENABLE_COMPONENT;
        }
      }), _dec7 = property({
        tooltip: '勾选后,会批量关闭 find list 中填写的组件',
        visible: function () {
          // @ts-ignore
          return this.actionType === ACTION_MODE.ENABLE_COMPONENT;
        }
      }), _dec8 = property({
        tooltip: '允许删除节点的组件,确定需要移除请勾选,防止误操作',
        visible: function () {
          // @ts-ignore
          return this.actionType === ACTION_MODE.DELETE_COMPONENT;
        }
      }), _dec9 = property({
        tooltip: '勾选后,会批量删除 find list 中填写的组件',
        displayName: '[ X DELETE X ]',
        visible: function () {
          // @ts-ignore
          return this.allowDelete && this.actionType === ACTION_MODE.DELETE_COMPONENT;
        }
      }), _dec10 = property({
        tooltip: '勾选后,会批量替换掉指定的路径',
        visible: function () {
          // @ts-ignore
          return this.actionType === ACTION_MODE.REPLACE_WATCH_PATH;
        }
      }), _dec11 = property({
        tooltip: '匹配的路径,匹配规则: 搜索开头为 game的路径',
        visible: function () {
          // @ts-ignore
          return this.actionType === ACTION_MODE.REPLACE_WATCH_PATH;
        }
      }), _dec12 = property({
        tooltip: '替换的路径,将匹配到的路径替换',
        visible: function () {
          // @ts-ignore
          return this.actionType === ACTION_MODE.REPLACE_WATCH_PATH;
        }
      }), _dec13 = property({
        tooltip: '是否搜集绑定VM组件的节点?',
        visible: function () {
          // @ts-ignore
          return this.actionType === ACTION_MODE.SEARCH_COMPONENT;
        }
      }), _dec14 = property({
        type: [Node],
        readonly: true,
        tooltip: '收集到绑定了VM组件相关的节点，可以自己跳转过去',
        visible: function () {
          // @ts-ignore
          return this.canCollectNodes && this.actionType === ACTION_MODE.SEARCH_COMPONENT;
        }
      }), ccclass(_class = executeInEditMode(_class = _dec(_class = _dec2(_class = (_class2 = class MVCompsEdit extends Component {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "findList", _descriptor, this);
          _initializerDefineProperty(this, "actionType", _descriptor2, this);
          _initializerDefineProperty(this, "allowDelete", _descriptor3, this);
          _initializerDefineProperty(this, "targetPath", _descriptor4, this);
          _initializerDefineProperty(this, "replacePath", _descriptor5, this);
          _initializerDefineProperty(this, "canCollectNodes", _descriptor6, this);
          _initializerDefineProperty(this, "collectNodes", _descriptor7, this);
        }
        get findTrigger() {
          return false;
        }
        set findTrigger(v) {
          this.setComponents(0);
        }
        get enableTrigger() {
          return false;
        }
        set enableTrigger(v) {
          this.setComponents(1);
        }
        get disableTrigger() {
          return false;
        }
        set disableTrigger(v) {
          this.setComponents(2);
        }
        get deleteTrigger() {
          return false;
        }
        set deleteTrigger(v) {
          this.setComponents(3);
        }
        get replaceTrigger() {
          return false;
        }
        set replaceTrigger(v) {
          this.setComponents(4);
        }
        onLoad() {
          if (VMEnv.editor) return;
          let path = this.getNodePath(this.node);
          console.error('you forget delete MVEditFinder,[path]', path);
        }
        setComponents(state) {
          let array = this.findList;
          let title = '搜索到当前节点下面的组件';
          switch (state) {
            case 0:
              title = '搜索到当前节点下面的组件';
              break;
            case 1:
              title = '激活以下节点的组件';
              break;
            case 2:
              title = '关闭以下节点的组件';
              break;
            case 3:
              title = '删除以下节点的组件';
              break;
            case 4:
              title = '替换以下节点的路径';
              break;
          }
          log(title);
          log('______________________');
          array.forEach(name => {
            this.searchComponent(name, state);
          });
          log('______________________');
        }

        /**
         * 
         * @param className 
         * @param state 0-查找节点组件 1-激活节点组件 2-关闭节点组件 3-移除节点组件
         */
        searchComponent(className, state = 0) {
          /**收集节点清空 */
          this.collectNodes = [];
          let comps = this.node.getComponentsInChildren(className);
          if (comps == null || comps.length < 1) return;
          log('[' + className + ']:');
          comps.forEach(v => {
            let ext = '';
            if (state <= 3) {
              //区分模板模式路径
              if (v.templateMode === true) {
                ext = v.watchPathArr ? ':[Path:' + v.watchPathArr.join('|') + ']' : '';
              } else {
                ext = v.watchPath ? ':[Path:' + v.watchPath + ']' : '';
              }
            }
            log(this.getNodePath(v.node) + ext);
            switch (state) {
              case 0:
                //寻找组件
                if (this.canCollectNodes) {
                  if (this.collectNodes.indexOf(v.node) === -1) {
                    this.collectNodes.push(v.node);
                  }
                }
                break;
              case 1:
                // 激活组件
                v.enabled = true;
                break;
              case 2:
                // 关闭组件
                v.enabled = false;
                break;
              case 3:
                // 删除组件
                v.node.removeComponent(v);
                break;
              case 4:
                // 替换指定路径
                let targetPath = this.targetPath;
                let replacePath = this.replacePath;
                if (v.templateMode === true) {
                  for (let i = 0; i < v.watchPathArr.length; i++) {
                    const path = v.watchPathArr[i];
                    v.watchPathArr[i] = this.replaceNodePath(path, targetPath, replacePath);
                  }
                } else {
                  v.watchPath = this.replaceNodePath(v.watchPath, targetPath, replacePath);
                }
            }
          });
        }
        replaceNodePath(path, search, replace) {
          let pathArr = path.split('.');
          let searchArr = search.split('.');
          let replaceArr = replace.split('.');
          let match = true;
          for (let i = 0; i < searchArr.length; i++) {
            //未匹配上
            if (pathArr[i] !== searchArr[i]) {
              match = false;
              break;
            }
          }

          //匹配成功准备替换路径
          if (match === true) {
            for (let i = 0; i < replaceArr.length; i++) {
              pathArr[i] = replaceArr[i];
            }
            log(' 路径更新:', path, '>>>', pathArr.join('.'));
          }
          return pathArr.join('.');
        }
        getNodePath(node) {
          let parent = node;
          let array = [];
          while (parent) {
            let p = parent.getParent();
            if (p) {
              array.push(parent.name);
              parent = p;
            } else {
              break;
            }
          }
          return array.reverse().join('/');
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "findList", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return ["VMBase", "VMParent"];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "actionType", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return ACTION_MODE.SEARCH_COMPONENT;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "findTrigger", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "findTrigger"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "enableTrigger", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "enableTrigger"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "disableTrigger", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "disableTrigger"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "allowDelete", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "deleteTrigger", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "deleteTrigger"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "replaceTrigger", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "replaceTrigger"), _class2.prototype), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "targetPath", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'game';
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "replacePath", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '*';
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "canCollectNodes", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "collectNodes", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/VMCustom.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './VMBase.ts', './VMEnv.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Toggle, VMBase, VMEnv;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Toggle = module.Toggle;
    }, function (module) {
      VMBase = module.VMBase;
    }, function (module) {
      VMEnv = module.VMEnv;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;
      cclegacy._RF.push({}, "ce662fwsSVPLKpmHx+KocFu", "VMCustom", undefined);
      const {
        ccclass,
        property,
        executeInEditMode,
        menu,
        help
      } = _decorator;

      /** 自动检查识别的数组,你可以准备自己的组件放上去自动识别 */
      const COMP_ARRAY_CHECK = [['BhvFrameIndex', 'index', false], ['BhvGroupToggle', 'index', false], ['BhvRollNumber', 'targetValue', false],
      // 组件名、默认属性、controller值
      ['cc.Label', 'string', false], ['cc.RichText', 'string', false], ['cc.EditBox', 'string', true], ['cc.Slider', 'progress', true], ['cc.ProgressBar', 'progress', false], ['cc.Toggle', 'isChecked', true]];

      /**
       * [VM-Custom]
       * 自定义数值监听, 可以快速对该节点上任意一个组件上的属性进行双向绑定
       */
      let VMCustom = exports('VMCustom', (_dec = menu('ModelViewer/VM-Custom (自定义VM)'), _dec2 = help('https://gitee.com/dgflash/oops-framework/blob/master/doc/mvvm/VMCustom.md'), _dec3 = property({
        tooltip: '激活controller,以开启双向绑定，否则只能接收消息'
      }), _dec4 = property({
        tooltip: "监视对象路径"
      }), _dec5 = property({
        tooltip: '绑定组件的名字'
      }), _dec6 = property({
        tooltip: '组件上需要监听的属性'
      }), _dec7 = property({
        tooltip: '刷新间隔频率(只影响脏检查的频率)',
        step: 0.01,
        range: [0, 1],
        visible: function () {
          // @ts-ignore
          return this.controller === true;
        }
      }), ccclass(_class = executeInEditMode(_class = _dec(_class = _dec2(_class = (_class2 = class VMCustom extends VMBase {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "controller", _descriptor, this);
          _initializerDefineProperty(this, "watchPath", _descriptor2, this);
          _initializerDefineProperty(this, "componentName", _descriptor3, this);
          _initializerDefineProperty(this, "componentProperty", _descriptor4, this);
          _initializerDefineProperty(this, "refreshRate", _descriptor5, this);
          /** 计时器 */
          this._timer = 0;
          /** 监听的组件对象 */
          this._watchComponent = null;
          /** 是否能监听组件的数据 */
          this._canWatchComponent = false;
          /** 检查的值 */
          this._oldValue = null;
        }
        onLoad() {
          super.onLoad();

          // 只在运行时检查组件是否缺失可用
          this.checkEditorComponent(); //编辑器检查

          if (VMEnv.editor) return;
          this._watchComponent = this.node.getComponent(this.componentName);
          this.checkComponentState();
        }
        onRestore() {
          this.checkEditorComponent();
        }
        start() {
          //从 watch 的路径中获取一个初始值
          this.onValueInit();
        }

        // 挂在对应节点后，自动获取组件属性和名字
        checkEditorComponent() {
          if (VMEnv.editor) return;
          let checkArray = COMP_ARRAY_CHECK;
          for (let i = 0; i < checkArray.length; i++) {
            const params = checkArray[i];
            let comp = this.node.getComponent(params[0]);
            if (comp) {
              if (this.componentName == '') this.componentName = params[0];
              if (this.componentProperty == '') this.componentProperty = params[1];
              if (params[2] !== null) this.controller = params[2];
              break;
            }
          }
        }
        checkComponentState() {
          this._canWatchComponent = false;
          if (!this._watchComponent) {
            console.error('未设置需要监听的组件');
            return;
          }
          if (!this.componentProperty) {
            console.error('未设置需要监听的组件 的属性');
            return;
          }
          if (this.componentProperty in this._watchComponent === false) {
            console.error('需要监听的组件的属性不存在');
            return;
          }
          this._canWatchComponent = true;
        }
        getComponentValue() {
          return this._watchComponent[this.componentProperty];
        }
        setComponentValue(value) {
          // 如果遇到 Toggle 组件就调用上面的方法解决
          if (this.componentName == "cc.Toggle") {
            this.node.getComponent(Toggle).isChecked = value;
          } else {
            this._watchComponent[this.componentProperty] = value;
          }
        }

        /** 初始化获取数据 */
        onValueInit() {
          if (VMEnv.editor) return;

          //更新信息
          this.setComponentValue(this.VM.getValue(this.watchPath));
        }

        /** [可重写]组件的值发生变化后，触发更新此值 */
        onValueController(newValue, oldValue) {
          this.VM.setValue(this.watchPath, newValue);
        }

        /** [可重写]初始化改变数据 */
        onValueChanged(n, o, pathArr) {
          this.setComponentValue(n);
        }
        update(dt) {
          // 脏检查（组件是否存在，是否被激活）
          if (VMEnv.editor) return;

          //if (this.templateMode == true) return; //todo 模板模式下不能计算  
          if (!this.controller) return;
          if (!this._canWatchComponent || this._watchComponent['enabled'] === false) return;

          //刷新频率检查
          this._timer += dt;
          if (this._timer < this.refreshRate) return;
          this._timer = 0;
          let oldValue = this._oldValue;
          let newValue = this.getComponentValue();
          if (this._oldValue === newValue) return;
          this._oldValue = this.getComponentValue();
          this.onValueController(newValue, oldValue);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "controller", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "watchPath", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "componentName", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "componentProperty", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "refreshRate", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      })), _class2)) || _class) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/VMEnv.ts", ['cc', './env'], function (exports) {
  var cclegacy, EDITOR;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      EDITOR = module.EDITOR;
    }],
    execute: function () {
      cclegacy._RF.push({}, "fdf72Q91PdCXpPQ+62s1ufi", "VMEnv", undefined);

      /** VM组件环境验证 */
      class VMEnv {
        /** 编辑状态 */
        static get editor() {
          // @ts-ignore
          return EDITOR;
        }
      }
      exports('VMEnv', VMEnv);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/VMEvent.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './VMBase.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, CCString, Enum, EventHandler, _decorator, VMBase;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      CCString = module.CCString;
      Enum = module.Enum;
      EventHandler = module.EventHandler;
      _decorator = module._decorator;
    }, function (module) {
      VMBase = module.VMBase;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;
      cclegacy._RF.push({}, "a9ce7kf8XZJeLPlT2iWn2zD", "VMEvent", undefined);

      // +普通 label 更新数据的情况,label.string = xxx;
      // +frameIndex 插件，通过number 数值设置 BhvFrameIndex 来切换当前贴图
      // +spriteFrame 直接替换贴图的情况 , 
      //  读取本地路径 data.spriteFrame = $res:/pic/com1
      //  读取网页路径 data.spriteFrame = $url:http:xxxxxxxxxx.png
      // +特殊条件控制 

      // 比较条件:,如果传入值 > /< />= /<= /== 某值时，执行的action类型

      const {
        ccclass,
        property,
        executeInEditMode,
        menu,
        help
      } = _decorator;
      var FILTER_MODE = /*#__PURE__*/function (FILTER_MODE) {
        FILTER_MODE[FILTER_MODE["none"] = 0] = "none";
        FILTER_MODE[FILTER_MODE["=="] = 1] = "==";
        FILTER_MODE[FILTER_MODE["!="] = 2] = "!=";
        FILTER_MODE[FILTER_MODE[">"] = 3] = ">";
        FILTER_MODE[FILTER_MODE[">="] = 4] = ">=";
        FILTER_MODE[FILTER_MODE["<"] = 5] = "<";
        FILTER_MODE[FILTER_MODE["<="] = 6] = "<=";
        return FILTER_MODE;
      }(FILTER_MODE || {}); // 正常计算，比较>=
      /**
       *  [VM-Event]
       * 提供  ViewModel 的相关基础功能,
       * 如果值发生变化将会调用对应的函数方法
       */
      let VMEvent = exports('default', (_dec = menu('ModelViewer/VM-EventCall(调用函数)'), _dec2 = help('https://gitee.com/dgflash/oops-framework/blob/master/doc/mvvm/VMEvent.md'), _dec3 = property({
        tooltip: '使用模板模式，可以使用多路径监听'
      }), _dec4 = property({
        tooltip: '监听获取值的路径',
        visible: function () {
          // @ts-ignore
          return this.templateMode === false;
        }
      }), _dec5 = property({
        tooltip: '触发一次后会自动关闭该事件'
      }), _dec6 = property({
        tooltip: '监听获取值的多条路径,这些值的改变都会通过这个函数回调,请使用 pathArr 区分获取的值 ',
        type: [CCString],
        visible: function () {
          // @ts-ignore
          return this.templateMode === true;
        }
      }), _dec7 = property({
        tooltip: '过滤模式，会根据条件过滤掉时间的触发',
        type: Enum(FILTER_MODE)
      }), _dec8 = property({
        visible: function () {
          // @ts-ignore
          return this.filterMode !== FILTER_MODE.none;
        }
      }), _dec9 = property([EventHandler]), ccclass(_class = executeInEditMode(_class = _dec(_class = _dec2(_class = (_class2 = class VMEvent extends VMBase {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "templateMode", _descriptor, this);
          _initializerDefineProperty(this, "watchPath", _descriptor2, this);
          _initializerDefineProperty(this, "triggerOnce", _descriptor3, this);
          _initializerDefineProperty(this, "watchPathArr", _descriptor4, this);
          _initializerDefineProperty(this, "filterMode", _descriptor5, this);
          _initializerDefineProperty(this, "compareValue", _descriptor6, this);
          _initializerDefineProperty(this, "changeEvents", _descriptor7, this);
        }
        onValueInit() {}
        onValueChanged(newVar, oldVar, pathArr) {
          let res = this.conditionCheck(newVar, this.compareValue);
          if (!res) return;
          if (Array.isArray(this.changeEvents)) {
            this.changeEvents.forEach(v => {
              v.emit([newVar, oldVar, pathArr]);
            });
          }

          // 激活一次后，自动关闭组件
          if (this.triggerOnce === true) {
            this.enabled = false;
          }
        }

        /** 条件检查 */
        conditionCheck(a, b) {
          let cod = FILTER_MODE;
          switch (this.filterMode) {
            case cod.none:
              return true;
            case cod["=="]:
              if (a == b) return true;
              break;
            case cod["!="]:
              if (a != b) return true;
              break;
            case cod["<"]:
              if (a < b) return true;
              break;
            case cod[">"]:
              if (a > b) return true;
              break;
            case cod[">="]:
              if (a >= b) return true;
              break;
            case cod["<"]:
              if (a < b) return true;
              break;
            case cod["<="]:
              if (a <= b) return true;
              break;
          }
          return false;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "templateMode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "watchPath", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "triggerOnce", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "watchPathArr", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "filterMode", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return FILTER_MODE.none;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "compareValue", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "changeEvents", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/VMLabel.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './StringFormat.ts', './VMBase.ts', './VMEnv.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, CCString, _decorator, error, StringFormatFunction, VMBase, VMEnv;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      CCString = module.CCString;
      _decorator = module._decorator;
      error = module.error;
    }, function (module) {
      StringFormatFunction = module.StringFormatFunction;
    }, function (module) {
      VMBase = module.VMBase;
    }, function (module) {
      VMEnv = module.VMEnv;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "545c05XsG9GDJispEGWKvYv", "VMLabel", undefined);
      const {
        ccclass,
        property,
        menu,
        executeInEditMode,
        help
      } = _decorator;
      const LABEL_TYPE = {
        CC_LABEL: 'cc.Label',
        CC_RICH_TEXT: 'cc.RichText',
        CC_EDIT_BOX: 'cc.EditBox'
      };

      /**
       *  [VM-Label]
       *  专门处理 Label 相关 的组件，如 ccLabel,ccRichText,ccEditBox
       *  可以使用模板化的方式将数据写入,可以处理字符串格式等
       *  todo 加入stringFormat 可以解析转换常见的字符串格式
       */
      let VMLabel = exports('default', (_dec = menu('ModelViewer/VM-Label(文本VM)'), _dec2 = help('https://gitee.com/dgflash/oops-framework/blob/master/doc/mvvm/VMLabel.md'), _dec3 = property({
        tooltip: '是否启用模板代码,只能在运行时之前设置,\n将会动态解析模板语法 {{0}},并且自动设置监听的路径'
      }), _dec4 = property({
        visible() {
          // @ts-ignore
          return this.templateMode === false;
        }
      }), _dec5 = property({
        readonly: true
      }), _dec6 = property({
        type: [CCString],
        visible() {
          // @ts-ignore
          return this.templateMode === true;
        }
      }), ccclass(_class = executeInEditMode(_class = _dec(_class = _dec2(_class = (_class2 = class VMLabel extends VMBase {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "templateMode", _descriptor, this);
          _initializerDefineProperty(this, "watchPath", _descriptor2, this);
          _initializerDefineProperty(this, "labelType", _descriptor3, this);
          _initializerDefineProperty(this, "watchPathArr", _descriptor4, this);
          /** 按照路径参数顺序保存的 值的数组（固定）*/
          this.templateValueArr = [];
          /** 保存着字符模板格式的数组 (只会影响显示参数) */
          this.templateFormatArr = [];
          /** 源字符串 */
          this.originText = null;
        }
        onRestore() {
          this.checkLabel();
        }
        onLoad() {
          super.onLoad();
          this.checkLabel();
          if (VMEnv.editor) return;
          if (this.templateMode) {
            this.originText = this.getLabelValue();
            this.parseTemplate();
          }
        }
        start() {
          if (VMEnv.editor) return;
          this.onValueInit();
        }

        // 解析模板 获取初始格式化字符串格式 的信息
        parseTemplate() {
          let regexAll = /\{\{(.+?)\}\}/g; // 匹配： 所有的{{value}}
          let regex = /\{\{(.+?)\}\}/; // 匹配： {{value}} 中的 value
          let res = this.originText.match(regexAll); // 匹配结果数组
          if (res == null) return;
          for (let i = 0; i < res.length; i++) {
            const e = res[i];
            let arr = e.match(regex);
            let matchName = arr[1];
            // let paramIndex = parseInt(matchName) || 0;
            let matchInfo = matchName.split(':')[1] || '';
            this.templateFormatArr[i] = matchInfo;
          }
        }

        /**获取解析字符串模板后得到的值 */
        getReplaceText() {
          if (!this.originText) return "";
          let regexAll = /\{\{(.+?)\}\}/g; // 匹配： 所有的{{value}}
          let regex = /\{\{(.+?)\}\}/; // 匹配： {{value}} 中的 value
          let res = this.originText.match(regexAll); // 匹配结果数组 [{{value}}，{{value}}，{{value}}]
          if (res == null) return ''; // 未匹配到文本
          let str = this.originText; // 原始字符串模板 "name:{{0}} 或 name:{{0:fix2}}"

          for (let i = 0; i < res.length; i++) {
            const e = res[i];
            let getValue;
            let arr = e.match(regex); // 匹配到的数组 [{{value}}, value]
            let indexNum = parseInt(arr[1] || '0') || 0; // 取出数组的 value 元素 转换成整数
            let format = this.templateFormatArr[i]; // 格式化字符 的 配置参数
            getValue = this.templateValueArr[indexNum];
            str = str.replace(e, this.getValueFromFormat(getValue, format)); //从路径缓存值获取数据
          }

          return str;
        }

        /** 格式化字符串 */
        getValueFromFormat(value, format) {
          return StringFormatFunction.deal(value, format);
        }

        /** 初始化获取数据 */
        onValueInit() {
          //更新信息
          if (this.templateMode === false) {
            this.setLabelValue(this.VM.getValue(this.watchPath)); //
          } else {
            let max = this.watchPathArr.length;
            for (let i = 0; i < max; i++) {
              this.templateValueArr[i] = this.VM.getValue(this.watchPathArr[i], '?');
            }
            this.setLabelValue(this.getReplaceText()); // 重新解析
          }
        }

        /** 监听数据发生了变动的情况 */
        onValueChanged(n, o, pathArr) {
          if (this.templateMode === false) {
            this.setLabelValue(n);
          } else {
            let path = pathArr.join('.');
            // 寻找缓存位置
            let index = this.watchPathArr.findIndex(v => v === path);
            if (index >= 0) {
              //如果是所属的路径，就可以替换文本了
              this.templateValueArr[index] = n; // 缓存值
              this.setLabelValue(this.getReplaceText()); // 重新解析文本
            }
          }
        }

        setLabelValue(value) {
          var component = this.getComponent(this.labelType);
          component.string = value + '';
        }
        getLabelValue() {
          var component = this.getComponent(this.labelType);
          return component.string;
        }
        checkLabel() {
          let checkArray = ['cc.Label', 'cc.RichText', 'cc.EditBox'];
          for (let i = 0; i < checkArray.length; i++) {
            const e = checkArray[i];
            let comp = this.node.getComponent(e);
            if (comp) {
              this.labelType = e;
              return true;
            }
          }
          error('没有挂载任何label组件');
          return false;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "templateMode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "watchPath", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "labelType", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return LABEL_TYPE.CC_LABEL;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "watchPathArr", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/VMModify.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './VMBase.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Enum, _decorator, VMBase;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Enum = module.Enum;
      _decorator = module._decorator;
    }, function (module) {
      VMBase = module.VMBase;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;
      cclegacy._RF.push({}, "7d2a4voaOJJGJZRWFPG6Bk7", "VMModify", undefined);
      const {
        ccclass,
        property,
        menu,
        help
      } = _decorator;

      /** 限制值边界范围的模式 */
      var CLAMP_MODE = /*#__PURE__*/function (CLAMP_MODE) {
        CLAMP_MODE[CLAMP_MODE["MIN"] = 0] = "MIN";
        CLAMP_MODE[CLAMP_MODE["MAX"] = 1] = "MAX";
        CLAMP_MODE[CLAMP_MODE["MIN_MAX"] = 2] = "MIN_MAX";
        return CLAMP_MODE;
      }(CLAMP_MODE || {});
      /**
       * [VM-Modify]
       * 动态快速的修改模型的数值,使用按钮 绑定该组件上的函数，即可动态调用
       * 修改 Model 的值
       */
      let VMModify = exports('default', (_dec = menu('ModelViewer/VM-Modify(修改Model)'), _dec2 = help('https://gitee.com/dgflash/oops-framework/blob/master/doc/mvvm/VMModify.md'), _dec3 = property({
        tooltip: "监视对象路径"
      }), _dec4 = property({
        tooltip: "是不启用取值范围限制"
      }), _dec5 = property({
        type: Enum(CLAMP_MODE),
        visible: function () {
          // @ts-ignore
          return this.valueClamp === true;
        }
      }), _dec6 = property({
        visible: function () {
          // @ts-ignore
          return this.valueClamp === true && this.valueClampMode !== CLAMP_MODE.MAX;
        }
      }), _dec7 = property({
        visible: function () {
          // @ts-ignore
          return this.valueClamp === true && this.valueClampMode !== CLAMP_MODE.MIN;
        }
      }), ccclass(_class = _dec(_class = _dec2(_class = (_class2 = class VMModify extends VMBase {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "watchPath", _descriptor, this);
          _initializerDefineProperty(this, "valueClamp", _descriptor2, this);
          _initializerDefineProperty(this, "valueClampMode", _descriptor3, this);
          _initializerDefineProperty(this, "valueMin", _descriptor4, this);
          _initializerDefineProperty(this, "valueMax", _descriptor5, this);
        }
        // 限制最终结果的取值范围
        clampValue(res) {
          let min = this.valueMin;
          let max = this.valueMax;
          if (this.valueClamp == false) return res;
          switch (this.valueClampMode) {
            case CLAMP_MODE.MIN_MAX:
              if (res > max) res = max;
              if (res < min) res = min;
              break;
            case CLAMP_MODE.MIN:
              if (res < min) res = min;
              break;
            case CLAMP_MODE.MAX:
              if (res > max) res = max;
              break;
          }
          return res;
        }

        /** 加整数 */
        vAddInt(e, data) {
          this.vAdd(e, data, true);
        }

        /** 减整数 */
        vSubInt(e, data) {
          this.vSub(e, data, true);
        }

        /** 乘整数 */
        vMulInt(e, data) {
          this.vMul(e, data, true);
        }

        /** 除整数 */
        vDivInt(e, data) {
          this.vDiv(e, data, true);
        }

        /** 加 */
        vAdd(e, data, int = false) {
          let a = parseFloat(data);
          let res = this.VM.getValue(this.watchPath, 0) + a;
          if (int) {
            res = Math.round(res);
          }
          this.VM.setValue(this.watchPath, this.clampValue(res));
        }

        /** 减 */
        vSub(e, data, int = false) {
          let a = parseFloat(data);
          let res = this.VM.getValue(this.watchPath, 0) - a;
          if (int) {
            res = Math.round(res);
          }
          this.VM.setValue(this.watchPath, this.clampValue(res));
        }

        /** 乘 */
        vMul(e, data, int = false) {
          let a = parseFloat(data);
          let res = this.VM.getValue(this.watchPath, 0) * a;
          if (int) {
            res = Math.round(res);
          }
          this.VM.setValue(this.watchPath, this.clampValue(res));
        }

        /** 除 */
        vDiv(e, data, int = false) {
          let a = parseFloat(data);
          let res = this.VM.getValue(this.watchPath, 0) / a;
          if (int) {
            res = Math.round(res);
          }
          this.VM.setValue(this.watchPath, this.clampValue(res));
        }

        /** 字符串赋值 */
        vString(e, data) {
          let a = data;
          this.VM.setValue(this.watchPath, a);
        }

        /** 整数赋值 */
        vNumberInt(e, data) {
          this.vNumber(e, data, true);
        }

        /** 数字赋值 */
        vNumber(e, data, int = false) {
          let a = parseFloat(data);
          if (int) {
            a = Math.round(a);
          }
          this.VM.setValue(this.watchPath, this.clampValue(a));
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "watchPath", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "valueClamp", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "valueClampMode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return CLAMP_MODE.MIN_MAX;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "valueMin", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "valueMax", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      })), _class2)) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/VMParent.ts", ['cc', './GameComponent.ts', './ViewModel.ts'], function (exports) {
  var cclegacy, _decorator, GameComponent, VM;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      GameComponent = module.GameComponent;
    }, function (module) {
      VM = module.VM;
    }],
    execute: function () {
      var _dec, _dec2, _class;
      cclegacy._RF.push({}, "15ccciO+ZRH476sPKD/LvB7", "VMParent", undefined);
      const {
        ccclass,
        help,
        executionOrder
      } = _decorator;

      /**
       * 提供VM环境，控制旗下所有VM节点
       * 一般用于 非全局的 VM绑定,VM 环境与 组件紧密相连
       * （Prefab 模式绑定）
       * VMParent 必须必其他组件优先执行
       * v0.1 修复bug ，现在可以支持 Parent 嵌套 （但是注意性能问题，不要频繁嵌套）
       */
      let VMParent = exports('default', (_dec = executionOrder(-1), _dec2 = help('https://gitee.com/dgflash/oops-framework/blob/master/doc/mvvm/VMParent.md'), ccclass(_class = _dec(_class = _dec2(_class = class VMParent extends GameComponent {
        constructor(...args) {
          super(...args);
          /** 绑定的标签，可以通过这个tag 获取 当前的 vm 实例 */
          this.tag = '_temp';
          /** 需要绑定的私有数据 */
          this.data = {};
          /**VM 管理 */
          this.VM = VM;
        }
        /**
         * [注意]不能直接覆盖此方法，如果需要覆盖。
         * 只能在该方法内部调用父类的实现 
         *   ```ts
         *       onLoad(){
         *           super.onLoad();
         *       }
         *   ``` 
         * 
         */
        onLoad() {
          if (this.data == null) return;
          this.tag = '_temp' + '<' + this.node.uuid.replace('.', '') + '>';
          VM.add(this.data, this.tag);
          // log(VM['_mvs'],this.tag)
          //搜寻所有节点：找到 watch path
          let comps = this.getVMComponents();
          // console.group();
          for (let i = 0; i < comps.length; i++) {
            const comp = comps[i];
            this.replaceVMPath(comp, this.tag);
          }
          // console.groupEnd()

          this.onBind();
        }

        /**在 onLoad 完成 和 start() 之前调用，你可以在这里进行初始化数据等操作 */
        onBind() {}

        /**在 onDestroy() 后调用,此时仍然可以获取绑定的 data 数据*/
        onUnBind() {}
        replaceVMPath(comp, tag) {
          // @ts-ignore
          let path = comp['watchPath'];
          // @ts-ignore
          if (comp['templateMode'] == true) {
            // @ts-ignore
            let pathArr = comp['watchPathArr'];
            if (pathArr) {
              for (let i = 0; i < pathArr.length; i++) {
                const path = pathArr[i];
                pathArr[i] = path.replace('*', tag);
              }
            }
          } else {
            // VMLabel
            // 遇到特殊 path 就优先替换路径
            if (path.split('.')[0] === '*') {
              // @ts-ignore
              comp['watchPath'] = path.replace('*', tag);
            }
          }
        }

        /** 未优化的遍历节点，获取VM 组件 */
        getVMComponents() {
          let comps = this.node.getComponentsInChildren('VMBase');
          let parents = this.node.getComponentsInChildren('VMParent').filter(v => v.uuid !== this.uuid); // 过滤掉自己

          //过滤掉不能赋值的parent
          let filters = [];
          parents.forEach(node => {
            filters = filters.concat(node.getComponentsInChildren('VMBase'));
          });
          comps = comps.filter(v => filters.indexOf(v) < 0);
          return comps;
        }

        /**
         * [注意]不能覆盖此方法，如果需要覆盖。
         * 需要在该方法内部调用父类的实现，再定义自己的方法
         * ```ts
         *   onDestroy(){
         *       super.onDestroy();
         *   }
         * ```
         */
        onDestroy() {
          this.onUnBind();

          // 解除全部引用
          VM.remove(this.tag);
          this.data = null;
          super.onDestroy();
        }
      }) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/VMProgress.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './StringFormat.ts', './VMCustom.ts', './VMEnv.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, CCString, _decorator, StringFormatFunction, VMCustom, VMEnv;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      CCString = module.CCString;
      _decorator = module._decorator;
    }, function (module) {
      StringFormatFunction = module.StringFormatFunction;
    }, function (module) {
      VMCustom = module.VMCustom;
    }, function (module) {
      VMEnv = module.VMEnv;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "2a50eqI7JZNV5Sh0y/Qd9C6", "VMProgress", undefined);
      const {
        ccclass,
        property,
        menu,
        help
      } = _decorator;
      let VMProgress = exports('default', (_dec = menu('ModelViewer/VM-Progress (VM-进度条)'), _dec2 = help('https://gitee.com/dgflash/oops-framework/blob/master/doc/mvvm/VMProgress.md'), _dec3 = property({
        visible: false,
        override: true
      }), _dec4 = property({
        type: [CCString],
        tooltip: '第一个值是min 值，第二个值 是 max 值，会计算出两者的比例'
      }), _dec5 = property({
        visible: function () {
          // @ts-ignore
          return this.componentProperty === 'string';
        },
        tooltip: '字符串格式化，和 VMLabel 的字段一样，需要填入对应的格式化字符串'
      }), ccclass(_class = _dec(_class = _dec2(_class = (_class2 = class VMProgress extends VMCustom {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "watchPath", _descriptor, this);
          _initializerDefineProperty(this, "watchPathArr", _descriptor2, this);
          this.templateMode = true;
          _initializerDefineProperty(this, "stringFormat", _descriptor3, this);
        }
        onLoad() {
          if (this.watchPathArr.length < 2 || this.watchPathArr[0] == '[min]' || this.watchPathArr[1] == '[max]') {
            console.error('VMProgress must have two values!');
          }
          super.onLoad();
        }
        start() {
          if (VMEnv.editor) return;
          this.onValueInit();
        }
        onValueInit() {
          let max = this.watchPathArr.length;
          for (let i = 0; i < max; i++) {
            this.templateValueArr[i] = this.VM.getValue(this.watchPathArr[i]);
          }
          let value = this.templateValueArr[0] / this.templateValueArr[1];
          this.setComponentValue(value);
        }
        setComponentValue(value) {
          if (this.stringFormat !== '') {
            let res = StringFormatFunction.deal(value, this.stringFormat);
            super.setComponentValue(res);
          } else {
            super.setComponentValue(value);
          }
        }
        onValueController(n, o) {
          let value = Math.round(n * this.templateValueArr[1]);
          if (Number.isNaN(value)) value = 0;
          this.VM.setValue(this.watchPathArr[0], value);
        }

        /** 初始化改变数据 */
        onValueChanged(n, o, pathArr) {
          if (this.templateMode === false) return;
          let path = pathArr.join('.');
          // 寻找缓存位置
          let index = this.watchPathArr.findIndex(v => v === path);
          if (index >= 0) {
            // 如果是所属的路径，就可以替换文本了
            this.templateValueArr[index] = n; //缓存值
          }

          let value = this.templateValueArr[0] / this.templateValueArr[1];
          if (value > 1) value = 1;
          if (value < 0 || Number.isNaN(value)) value = 0;
          this.setComponentValue(value);
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "watchPath", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "watchPathArr", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return ['[min]', '[max]'];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "stringFormat", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      })), _class2)) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/VMState.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './VMBase.ts', './ViewModel.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Enum, CCInteger, Node, _decorator, Button, Sprite, UIRenderer, color, UIOpacity, VMBase, VM;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Enum = module.Enum;
      CCInteger = module.CCInteger;
      Node = module.Node;
      _decorator = module._decorator;
      Button = module.Button;
      Sprite = module.Sprite;
      UIRenderer = module.UIRenderer;
      color = module.color;
      UIOpacity = module.UIOpacity;
    }, function (module) {
      VMBase = module.VMBase;
    }, function (module) {
      VM = module.VM;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14;
      cclegacy._RF.push({}, "47052uw/Y5O1LXaLObj4ARx", "VMState", undefined);
      const {
        ccclass,
        property,
        menu,
        help
      } = _decorator;

      /** 比较条件 */
      var CONDITION = /*#__PURE__*/function (CONDITION) {
        CONDITION[CONDITION["=="] = 0] = "==";
        CONDITION[CONDITION["!="] = 1] = "!=";
        CONDITION[CONDITION[">"] = 2] = ">";
        CONDITION[CONDITION[">="] = 3] = ">=";
        CONDITION[CONDITION["<"] = 4] = "<";
        CONDITION[CONDITION["<="] = 5] = "<=";
        CONDITION[CONDITION["range"] = 6] = "range";
        return CONDITION;
      }(CONDITION || {});
      var ACTION = /*#__PURE__*/function (ACTION) {
        ACTION[ACTION["NODE_ACTIVE"] = 0] = "NODE_ACTIVE";
        ACTION[ACTION["NODE_VISIBLE"] = 1] = "NODE_VISIBLE";
        ACTION[ACTION["NODE_OPACITY"] = 2] = "NODE_OPACITY";
        ACTION[ACTION["NODE_COLOR"] = 3] = "NODE_COLOR";
        ACTION[ACTION["COMPONENT_CUSTOM"] = 4] = "COMPONENT_CUSTOM";
        ACTION[ACTION["SPRITE_GRAYSCALE"] = 5] = "SPRITE_GRAYSCALE";
        ACTION[ACTION["BUTTON_INTERACTABLE"] = 6] = "BUTTON_INTERACTABLE";
        return ACTION;
      }(ACTION || {}); // 满足条件的节点cc.BUTTON组件,
      var CHILD_MODE_TYPE = /*#__PURE__*/function (CHILD_MODE_TYPE) {
        CHILD_MODE_TYPE[CHILD_MODE_TYPE["NODE_INDEX"] = 0] = "NODE_INDEX";
        CHILD_MODE_TYPE[CHILD_MODE_TYPE["NODE_NAME"] = 1] = "NODE_NAME";
        return CHILD_MODE_TYPE;
      }(CHILD_MODE_TYPE || {});
      /**
       * [VM-State]
       * 监听数值状态,根据数值条件设置节点是否激活
       */
      let VMState = exports('default', (_dec = menu('ModelViewer/VM-State (VM状态控制)'), _dec2 = help('https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMState.md'), _dec3 = property({
        tooltip: '遍历子节点,根据子节点的名字或名字转换为值，判断值满足条件 来激活'
      }), _dec4 = property({
        type: Enum(CONDITION)
      }), _dec5 = property({
        type: Enum(CHILD_MODE_TYPE),
        tooltip: '遍历子节点,根据子节点的名字转换为值，判断值满足条件 来激活',
        visible: function () {
          // @ts-ignore
          return this.foreachChildMode === true;
        }
      }), _dec6 = property({
        displayName: 'Value: a',
        visible: function () {
          // @ts-ignore
          return this.foreachChildMode === false;
        }
      }), _dec7 = property({
        displayName: 'Value: b',
        visible: function () {
          // @ts-ignore
          return this.foreachChildMode === false && this.condition === CONDITION.range;
        }
      }), _dec8 = property({
        type: Enum(ACTION),
        tooltip: '一旦满足条件就对节点执行操作'
      }), _dec9 = property({
        visible: function () {
          // @ts-ignore
          return this.valueAction === ACTION.NODE_OPACITY;
        },
        range: [0, 255],
        type: CCInteger,
        displayName: 'Action Opacity'
      }), _dec10 = property({
        visible: function () {
          // @ts-ignore
          return this.valueAction === ACTION.NODE_COLOR;
        },
        displayName: 'Action Color'
      }), _dec11 = property({
        visible: function () {
          // @ts-ignore
          return this.valueAction === ACTION.COMPONENT_CUSTOM;
        },
        displayName: 'Component Name'
      }), _dec12 = property({
        visible: function () {
          // @ts-ignore
          return this.valueAction === ACTION.COMPONENT_CUSTOM;
        },
        displayName: 'Component Property'
      }), _dec13 = property({
        visible: function () {
          // @ts-ignore
          return this.valueAction === ACTION.COMPONENT_CUSTOM;
        },
        displayName: 'Default Value'
      }), _dec14 = property({
        visible: function () {
          // @ts-ignore
          return this.valueAction === ACTION.COMPONENT_CUSTOM;
        },
        displayName: 'Action Value'
      }), _dec15 = property({
        type: [Node],
        tooltip: '需要执行条件的节点，如果不填写则默认会执行本节点以及本节点的所有子节点 的状态'
      }), ccclass(_class = _dec(_class = _dec2(_class = (_class2 = class VMState extends VMBase {
        constructor(...args) {
          super(...args);
          _initializerDefineProperty(this, "watchPath", _descriptor, this);
          _initializerDefineProperty(this, "foreachChildMode", _descriptor2, this);
          _initializerDefineProperty(this, "condition", _descriptor3, this);
          _initializerDefineProperty(this, "foreachChildType", _descriptor4, this);
          _initializerDefineProperty(this, "valueA", _descriptor5, this);
          _initializerDefineProperty(this, "valueB", _descriptor6, this);
          _initializerDefineProperty(this, "valueAction", _descriptor7, this);
          _initializerDefineProperty(this, "valueActionOpacity", _descriptor8, this);
          _initializerDefineProperty(this, "valueActionColor", _descriptor9, this);
          _initializerDefineProperty(this, "valueComponentName", _descriptor10, this);
          _initializerDefineProperty(this, "valueComponentProperty", _descriptor11, this);
          _initializerDefineProperty(this, "valueComponentDefaultValue", _descriptor12, this);
          _initializerDefineProperty(this, "valueComponentActionValue", _descriptor13, this);
          _initializerDefineProperty(this, "watchNodes", _descriptor14, this);
        }
        onLoad() {
          super.onLoad();
          // 如果数组里没有监听值，那么默认把所有子节点给监听了
          if (this.watchNodes.length == 0) {
            if (this.valueAction !== ACTION.NODE_ACTIVE && this.foreachChildMode === false) {
              this.watchNodes.push(this.node);
            }
            this.watchNodes = this.watchNodes.concat(this.node.children);
          }
        }
        start() {
          if (this.enabled) {
            this.onValueInit();
          }
        }

        // 当值初始化时
        onValueInit() {
          let value = VM.getValue(this.watchPath);
          this.checkNodeFromValue(value);
        }

        // 当值被改变时
        onValueChanged(newVar, oldVar, pathArr) {
          this.checkNodeFromValue(newVar);
        }

        // 检查节点值更新
        checkNodeFromValue(value) {
          if (this.foreachChildMode) {
            this.watchNodes.forEach((node, index) => {
              let v = this.foreachChildType === CHILD_MODE_TYPE.NODE_INDEX ? index : node.name;
              let check = this.conditionCheck(value, v);
              // log('遍历模式', value, node.name, check);
              this.setNodeState(node, check);
            });
          } else {
            let check = this.conditionCheck(value, this.valueA, this.valueB);
            this.setNodesStates(check);
          }
        }

        // 更新 多个节点 的 状态
        setNodesStates(checkState) {
          let nodes = this.watchNodes;
          let check = checkState;
          nodes.forEach(node => {
            this.setNodeState(node, check);
          });
        }

        /** 更新单个节点的状态 */
        setNodeState(node, checkState) {
          let n = this.valueAction;
          let check = checkState;
          switch (n) {
            case ACTION.NODE_ACTIVE:
              node.active = check ? true : false;
              break;
            case ACTION.NODE_VISIBLE:
              {
                let opacity = node.getComponent(UIOpacity);
                if (opacity == null) opacity = node.addComponent(UIOpacity);
                if (opacity) {
                  opacity.opacity = check ? 255 : 0;
                }
                break;
              }
            case ACTION.NODE_OPACITY:
              {
                let opacity = node.getComponent(UIOpacity);
                if (opacity == null) opacity = node.addComponent(UIOpacity);
                if (opacity) {
                  opacity.opacity = check ? this.valueActionOpacity : 255;
                }
                break;
              }
            case ACTION.NODE_COLOR:
              {
                let uir = node.getComponent(UIRenderer);
                if (uir) {
                  uir.color = check ? this.valueActionColor : color(255, 255, 255);
                }
                break;
              }
            case ACTION.COMPONENT_CUSTOM:
              let comp = node.getComponent(this.valueComponentName);
              if (comp == null) return;
              if (this.valueComponentProperty in comp) {
                comp[this.valueComponentProperty] = check ? this.valueComponentActionValue : this.valueComponentDefaultValue;
              }
              break;
            case ACTION.SPRITE_GRAYSCALE:
              {
                let sprite = node.getComponent(Sprite);
                if (sprite) {
                  sprite.grayscale = check;
                }
                break;
              }
            case ACTION.BUTTON_INTERACTABLE:
              {
                let sprite = node.getComponent(Button);
                if (sprite) {
                  sprite.interactable = check;
                }
                break;
              }
          }
        }

        /** 条件检查 */
        conditionCheck(v, a, b) {
          let cod = CONDITION;
          switch (this.condition) {
            case cod["=="]:
              if (v == a) return true;
              break;
            case cod["!="]:
              if (v != a) return true;
              break;
            case cod["<"]:
              if (v < a) return true;
              break;
            case cod[">"]:
              if (v > a) return true;
              break;
            case cod[">="]:
              if (v >= a) return true;
              break;
            case cod["<"]:
              if (v < a) return true;
              break;
            case cod["<="]:
              if (v <= a) return true;
              break;
            case cod["range"]:
              if (v >= a && v <= b) return true;
              break;
          }
          return false;
        }
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "watchPath", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "foreachChildMode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "condition", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return CONDITION["=="];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "foreachChildType", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return CHILD_MODE_TYPE.NODE_INDEX;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "valueA", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "valueB", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "valueAction", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return ACTION.NODE_ACTIVE;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "valueActionOpacity", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "valueActionColor", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return color(155, 155, 155);
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "valueComponentName", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "valueComponentProperty", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "valueComponentDefaultValue", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "valueComponentActionValue", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "watchNodes", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/WebSock.ts", ['cc', './Logger.ts'], function (exports) {
  var cclegacy, Logger;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Logger = module.Logger;
    }],
    execute: function () {
      cclegacy._RF.push({}, "70df2VbIU9B66Fr+op8FKJp", "WebSock", undefined);
      /**
       * WebSocket 封装
       * 1. 连接/断开相关接口
       * 2. 网络异常回调
       * 3. 数据发送与接收
       */
      class WebSock {
        constructor() {
          this._ws = null;
          // websocket对象
          /** 网络连接成功事件 */
          this.onConnected = null;
          /** 接受到网络数据事件 */
          this.onMessage = null;
          /** 网络错误事件 */
          this.onError = null;
          /** 网络断开事件 */
          this.onClosed = null;
        }
        /** 请求连接 */
        connect(options) {
          if (this._ws) {
            if (this._ws.readyState === WebSocket.CONNECTING) {
              Logger.logNet("websocket connecting, wait for a moment...");
              return false;
            }
          }
          let url = null;
          if (options.url) {
            url = options.url;
          } else {
            let ip = options.ip;
            let port = options.port;
            let protocol = options.protocol;
            url = `${protocol}://${ip}:${port}`;
          }
          this._ws = new WebSocket(url);
          this._ws.binaryType = options.binaryType ? options.binaryType : "arraybuffer";
          this._ws.onmessage = event => {
            let onMessage = this.onMessage;
            onMessage(event.data);
          };
          this._ws.onopen = this.onConnected;
          this._ws.onerror = this.onError;
          this._ws.onclose = this.onClosed;
          return true;
        }

        /**
         * 发送数据 
         * @param buffer 网络数据
         */
        send(buffer) {
          if (this._ws && this._ws.readyState == WebSocket.OPEN) {
            this._ws.send(buffer);
            return 1;
          }
          return -1;
        }

        /**
         * 网络断开
         * @param code      关闭码
         * @param reason    关闭原因
         */
        close(code, reason) {
          if (this._ws) {
            this._ws.close(code, reason);
          }
        }
      }
      exports('WebSock', WebSock);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ZipLoader.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      // import { BufferAsset, SpriteFrame, Texture2D } from "cc";
      cclegacy._RF.push({}, "93752B11JtAIJAMnoxy6BF5", "ZipLoader", undefined);
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});