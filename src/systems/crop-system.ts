import { EntitySystem } from '../engine/system/system';
import { Entity } from '../engine/entity/entity';
import { AnimationComponent } from '../components/animation-component';
import { CropComponent } from '../components/crop-component';
import { ProjectileEntity } from '../entities/projectile-entity';
import { PlayerEntity } from '../entities/player-entity';
import { PositionComponent } from '../components/position-component';
import { Game } from '../engine/game';
import { InventoryComponent } from '../components/inventory-component/inventory-component';
import { GameEvent } from '../engine/events/game-event';
import { EventType } from '../engine/events/EventType';

export class CropSystem extends EntitySystem {
    constructor(game:Game){
        super(game);
    }
    apply(entity:Entity):void{
        var a:AnimationComponent = <AnimationComponent>entity.getComponent("animation", true);
        var c:CropComponent = <CropComponent>entity.getComponent("crop", true);
        var p:PositionComponent = <PositionComponent>entity.getComponent("position", true);
        if(a==null||c==null){
            return;
        }
        if (c.timeSinceGrowth == 0 || c.timeSinceGrowth==1){
            a.setSprite(c.growthSprites[c.growthStage]);
        }
    };

    applyEvents(entity:Entity):void{
        var c:CropComponent = <CropComponent>entity.getComponent("crop", true);
        if(c==null)return;

        var event:GameEvent;
        for(var i:number=0;i<entity.targetedEvents.length;i++){
            event = entity.targetedEvents[i];
            this.handleEvent(event, entity);
        }
    };
    static create(game:Game):EntitySystem{
        return new CropSystem(game);
    };

    private handleCollision(event:GameEvent, entity:Entity){
        if(!(event.eventData instanceof PlayerEntity)){
            return;
        }
        let crop:CropComponent = <CropComponent>entity.getComponent("crop");
        let player:PlayerEntity = <PlayerEntity>event.eventData;
        let playerInventory:InventoryComponent;
        playerInventory = <InventoryComponent>player.getComponent("inventory");
        if(crop.isGrown()){
            playerInventory.addItem(crop.cropName, 1);
        }
        entity.destroyed = true;

    }

    private handleEvent(event:GameEvent, entity:Entity):void{
        //console.log(event)
        switch (event.eventName){
            case EventType.collision:
                this.handleCollision(event, entity);
                break;
        }
    }
}