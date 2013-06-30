(function (window) {

    var BitmapItem = function (spriteSheet, params) {
        this.initialize(spriteSheet);
        for (var k in params) {
            if (params.hasOwnProperty(k)) {
                this[k] = params[k];
            }
        }
    };

    BitmapItem.TYPE_SWORD = "sword";
    BitmapItem.TYPE_SHIELD = "shield";
    BitmapItem.TYPE_MISC = "misc";

    BitmapItem.TYPE_BULLET = "bullet";
    BitmapItem.TYPE_BOMB = "bomb";
    BitmapItem.TYPE_BOMB_TIMER = "bombTimer";
    BitmapItem.TYPE_BOMB_REMOTE = "bombRemote";


    var p = BitmapItem.prototype = new createjs.BitmapAnimation();

    p.BitmapAnimation_initialize = p.initialize;
    p.BitmapAnimation_clone = p.clone;

    p.onPick = function (character) {
        var _this = this;
        var context = character.context;
        switch (_this.type) {
            case BitmapItem.TYPE_SWORD:
            case BitmapItem.TYPE_BOMB:
            case BitmapItem.TYPE_BOMB_REMOTE:
                context.playSound("pickup");
                character.equipRight(_this);
                break;
            case BitmapItem.TYPE_SHIELD:
                context.playSound("pickup");
                character.equipLeft(_this);
                break;
            default:
                _this.onUse(character, character);
                break;
        }
        context.removeFromStage(_this);
        for (var k in context.dropItems) {
            if (context.dropItems.hasOwnProperty(k)) {
                if (_this == context.dropItems[k]) {
                    context.dropItems.splice(k, 1);
                    delete _this;
                    break;
                }
            }
        }
        delete _this;
    };

    p.drop = function (context, x, y) {
        var _clone = this.clone();
        if (!_clone.currentAnimation.endsWith("_")) {
            _clone.gotoAndStop(_clone.currentAnimation + "_");
        }
        _clone.x = x;
        _clone.y = y;
        context.dropItems.push(_clone);
        context.addToStage(_clone);
    };

    p.onUse = function (character, target) {
        var _this = this;
        _this.useCharacter = character;
        switch (_this.type) {
            case BitmapItem.TYPE_SWORD:
                break;
            case BitmapItem.TYPE_SHIELD:
                var damage = Math.ceil(Math.random() * 5 + 5);
                character.HP -= Math.max(0, (damage - _this.bonusPoint * 2));
                _this.HP -= Math.max(0, damage - _this.bonusPoint);
                if (_this.HP <= 0) {
                    character.ejectLeft();
                }
                break;
        }
    };

    p.isThrowWeapon = function () {
        var _this = this;
        return (_this.type == BitmapItem.TYPE_BOMB
            || _this.type == BitmapItem.TYPE_BOMB_REMOTE
            || _this.type == BitmapItem.TYPE_BOMB_TIMER);
    };

    p.clone = function () {
        var _this = this;
        var _clone = _this.BitmapAnimation_clone();
        _clone.BitmapAnimation_clone = _this.BitmapAnimation_clone;
        _clone.HP = _this.HP;
        _clone.leftTime = _this.leftTime;
        _clone.bonusPoint = _this.bonusPoint;
        _clone.range = _this.range;
        _clone.range2d = _this.range2d;
        _clone.speed = _this.speed;
        _clone.useCharacter = _this.useCharacter;
        _clone.vX = _this.vX;
        _clone.vY = _this.vY;
        _clone.type = _this.type;
        _clone.onPick = _this.onPick;
        _clone.drop = _this.drop;
        _clone.onUse = _this.onUse;
        _clone.isThrowWeapon = _this.isThrowWeapon;
        _clone.clone = _this.clone;
        return _clone;
    };

    /**
     * Initialization method.
     * @method initialize
     * @protected
     */
    p.initialize = function (spriteSheet) {
        this.BitmapAnimation_initialize(spriteSheet);
        this.HP = 0;
        this.leftTime = 0;
        this.bonusPoint = 0;
        this.range = 0;
        this.vX = 0;
        this.vY = 0;
        this.range2d = "0x0"; //radius x angle
        this.speed = 0;
        this.useCharacter = null;
        this.type = null;
    };
    window.BitmapItem = BitmapItem;
}(window));