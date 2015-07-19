//
//  Employee.h
//  zShift
//
//  Created by Atomicflare on 2015-07-18.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, ShiftStatus) {
    ShiftStatusPending,
    ShiftStatusStarted,
    ShiftStatusFinished
};


@interface Shift : NSObject

@property (nonatomic,strong) NSString * name;
@property (nonatomic,assign) ShiftStatus status;
@property (nonatomic,strong) NSString * startTime;
@property (nonatomic,strong) NSString * endTime;

@property (nonatomic,strong) NSString * actualStartTime;
@property (nonatomic,strong) NSString * actualEndTime;
@property (nonatomic,strong) UIImage  * employeeImage;
@property (nonatomic,strong) NSString * shiftID;


- (instancetype)initWithDict:(NSDictionary*)dict;
-(NSDictionary*)dataOutput;// depricated

@end
