class Orbit{
    constructor(bodyA,bodyB,length){
        var options = {
            bodyA: bodyA,
            bodyB: bodyB,
            stiffness: 0.5,
            length: length
        }
        
        this.orbit = Constraint.create(options);

        World.add(world,this.orbit);
    }

    launch(){
        this.orbit.bodyA = null;
    }

    set_orbit(body){
        this.orbit.bodyA = body;
    }

    display(){
        if (this.orbit.bodyA){
            var pointA = this.orbit.bodyA.position;
            var pointB = this.orbit.bodyB.position;
            push();
            stroke("skyblue");
            strokeWeight(2.5)
            line(pointA.x,pointA.y,pointB.x,pointB.y);
            pop();
        }
    }
}