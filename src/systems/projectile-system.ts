import { EntitySystem } from './system';
import { Game } from '../game';
import { Entity } from '../entities/entity';
import { PositionComponent } from '../components/position-component';
import { ProjectileComponent } from '../components/projectile-component';
import { ProjectileEntity } from '../entities/projectile-entity';
import { GameEvent, EventType } from '../events/event-manager';

export class ProjectileSystem extends EntitySystem {

    constructor(game:Game){
        super(game);
    }

    apply(entity:Entity){
        var position:PositionComponent = <PositionComponent> entity.getComponent("position", true);
        var projectileComponent:ProjectileComponent = <ProjectileComponent>entity.getComponent("projectile", true);
        //console.log(projectileComponent)
        if(position == null)return
        if(projectileComponent == null)return
        projectileComponent.lifeSpan--;
        if (projectileComponent.lifeSpan == 0){
            //position.y -= 50;
            this.game.destroy(entity);
        }
    }

    fireProjectile(entity:Entity){
        var projectile:ProjectileEntity = <ProjectileEntity>this.game.addEntity("projectile");
        var projPosition:PositionComponent = <PositionComponent>projectile.getComponent("position");
        var position:PositionComponent = <PositionComponent>entity.getComponent("position");
        projPosition.x = position.x;
        projPosition.y = position.y;
        projPosition.vx = position.faceX;
        projPosition.vy = position.faceY;
        projPosition.faceRight = position.faceRight;
    }

    applyEvents(entity:Entity){
        var events:GameEvent[] = entity.targetedEvents;
        var event:GameEvent;
        for(var i=0;i<events.length;i++){
            event = events[i];
            switch(event.eventName){
                case EventType.fireProjectile:
                    this.fireProjectile(entity);
                break;
            }
        }
        entity.targetedEvents = [];
    }

    static create(game:Game):ProjectileSystem{
        return new ProjectileSystem(game);
    }
}