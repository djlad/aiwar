import { EntitySystem } from './system';
import { Entity } from '../entities/entity';
import { GameEvent, EventManager, EventType } from '../events/event-manager';
import { WasdComponent } from '../components/wasd-component';
import { PositionComponent } from '../components/position-component';
import { AnimationComponent } from '../components/animation-component';

export class WasdSystem extends EntitySystem {
    constructor(){
        super();
    }
    static create(eventManager:EventManager):WasdSystem{
        var wasd:WasdSystem = new WasdSystem();
        eventManager.addListener(EventType.wDown, function(){
            //console.log("w down")
        });
        return wasd;
    }

    apply(){}

    applyEvents(entity:Entity, eventManager:EventManager){
        var events:{[key:string]:GameEvent[]} = eventManager.events;
        var wasdComponent:WasdComponent= <WasdComponent>entity.getComponent("wasd", true);
        if (wasdComponent == null)return;
        var position:PositionComponent = <PositionComponent>entity.getComponent("position");
        var animation:AnimationComponent = <AnimationComponent>entity.getComponent("animation");
        
        var speed:number = wasdComponent.speed;
        var sprite:string = wasdComponent.sprite;
        var walkSprite:string = wasdComponent.walkSprite;

        if(EventType.wDown in events){
            animation.setSprite(walkSprite);
            position.vy = -speed;
        } else if(position.vy == -speed){
            animation.setSprite(sprite);
            position.vy = 0;
        }
        
        if(EventType.aDown in events){
            position.faceRight = false;
            animation.setSprite(walkSprite);
            position.vx = -speed;
        } else if(position.vx == -speed){
            animation.setSprite(sprite);
            position.vx = 0;
        }
        
        if(EventType.sDown in events){
            animation.setSprite(walkSprite);
            position.vy = speed;
        } else if(position.vy == speed){
            animation.setSprite(sprite);
            position.vy = 0;
        }

        if(EventType.dDown in events){
            position.faceRight = true;
            animation.setSprite(walkSprite);
            position.vx = speed;
        } else if(position.vx == speed){
            animation.setSprite(sprite);
            position.vx = 0;
        }
    }
}