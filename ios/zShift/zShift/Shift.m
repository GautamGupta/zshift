//
//  Employee.m
//  zShift
//
//  Created by Atomicflare on 2015-07-18.
//
//

#import "Shift.h"

@implementation Shift

@synthesize status,name,employeeImage,actualEndTime,actualStartTime,endTime,startTime,shiftID;

-(instancetype)initWithDict:(NSDictionary*)dict
{
    self = [super init];
    if (self) {
        self.name       = dict[@"employee"][@"name"];
        self.startTime  = dict[@"startTime"];
        self.endTime    = dict[@"endTime"];
        self.shiftID    = dict[@"_id"];
        
        if ([dict objectForKey:@"endedAt"] ) {
            self.status = ShiftStatusFinished;
        } else if ([dict objectForKey:@"startedAt"]) {
            self.status = ShiftStatusStarted;
        } else {
            self.status = ShiftStatusPending;
        }
        
    }
    return self;
}


-(NSDictionary*)dataOutput
{

    return @{};
}

// for debugging
-(NSString*)description
{
    
    
    return [NSString stringWithFormat:@"Shifter Name: %@  sStartTime: %@ sEndTime: %@  StartTime: %@ EndTime: %@  Status:%d",self.name,self.startTime,self.endTime,self.actualStartTime,self.actualEndTime,self.status];
}


@end
