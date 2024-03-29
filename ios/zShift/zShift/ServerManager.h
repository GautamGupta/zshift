//
//  ServerManager.h
//  zShift
//
//  Created by Atomicflare on 2015-07-18.
//
//

#import <Foundation/Foundation.h>


typedef NS_ENUM(NSInteger, ConnnectionType) {
    ConnnectionTypeAuthentication   = 0,
    ConnnectionTypeUpdate           = 1,
    ConnnectionTypePunchIn          = 2,
    ConnnectionTypePunchOut         = 3,
    ConnnectionTypeGetAllShifts     = 4
};



@class ServerManager;
// PROTOCOL
@protocol ServerManagerConnectionDelegate <NSObject>

-(void)onConnectionStart:(ServerManager*)serverManager;

-(void)onConnectionFinish:(ServerManager*)serverManager;

-(void)onConnectionError:(ServerManager*)serverManager;

@end






@interface ServerManager : NSObject <NSURLConnectionDataDelegate,NSURLConnectionDelegate>

@property (assign)    ConnnectionType connectionType;
@property id <ServerManagerConnectionDelegate> delegate;
@property NSDictionary * collectedData;

+(ServerManager*)getInstance;

-(void)authenticate:(NSString*)username password:(NSString*)password;

-(void)punchIn:(NSDictionary*)employeeData;

-(void)punchOut:(NSDictionary*)employeeData;


-(void)pullAllShifts;

@end
