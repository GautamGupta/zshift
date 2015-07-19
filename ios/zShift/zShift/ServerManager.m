//
//  ServerManager.m
//  zShift
//
//  Created by Atomicflare on 2015-07-18.
//
//
#import <UIKit/UIKit.h>
#import "ServerManager.h"

@implementation ServerManager 
{

    NSMutableData * _data;

    
}

static ServerManager * instance;

+(ServerManager*)getInstance
{
    if (!instance) {
        instance  = [[ServerManager alloc]init];
    }
    return instance;
}



@synthesize delegate        = _delegate;
@synthesize collectedData   = _collectedData;

#define mark -
#pragma mark Main Methods

-(void)authenticate:(NSString*)username password:(NSString*)password
{
    
    NSDictionary        * postData      = @{@"email":username,@"password":password};
    NSURL               * url           = [NSURL URLWithString:@"http://zshift.herokuapp.com/api/auth/signin"];
    NSMutableURLRequest * request       = [[NSMutableURLRequest alloc] initWithURL:url];
    NSError             * error         = nil;
    NSData              * requestData   =  [NSJSONSerialization dataWithJSONObject:postData options:0 error:&error];
    
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [request setValue:@"application/json; charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    [request setValue:[NSString stringWithFormat:@"%d", [requestData length]] forHTTPHeaderField:@"Content-Length"];
    [request setHTTPBody:requestData];
    
    NSURLConnection * c     = [[NSURLConnection alloc]initWithRequest:request delegate:self];
    self.connectionType     = ConnnectionTypeAuthentication;
    [c start];
    
    
    if (_delegate){
        [_delegate onConnectionStart:self];
    }
    if(c) {
        NSLog(@"Connection Successful");
    } else {
        NSLog(@"Connection could not be made");
    }
}


-(void)pullAllShifts
{

    NSURL               * url         = [NSURL URLWithString:@"http://zshift.herokuapp.com/api/shifts"];
    NSMutableURLRequest * request     = [[NSMutableURLRequest alloc] initWithURL:url];
//    [request setHTTPMethod:@"GET"];
    NSURLConnection * c     = [[NSURLConnection alloc]initWithRequest:request delegate:self];
    self.connectionType          = ConnnectionTypeGetAllShifts;
    [c start];
    if (_delegate){
        [_delegate onConnectionStart:self];
    }
}



-(void)punchIn:(NSDictionary*)employeeData
{
    
    
    NSDictionary        * postData      = @{@"startedAt":employeeData[@"startedAt"]};
    NSString            * stringURL     = [NSString stringWithFormat:@"http://zshift.herokuapp.com/api/shifts/%@",employeeData[@"_id"]];
    NSURL               * url           = [NSURL URLWithString:stringURL];
    NSMutableURLRequest * request       = [[NSMutableURLRequest alloc] initWithURL:url];
    NSError             * error         = nil;
    NSData              * requestData   =  [NSJSONSerialization dataWithJSONObject:postData options:0 error:&error];
    
    [request setHTTPMethod:@"PUT"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [request setValue:@"application/json; charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    [request setValue:[NSString stringWithFormat:@"%d", [requestData length]] forHTTPHeaderField:@"Content-Length"];
    [request setHTTPBody:requestData];
    
    NSURLConnection * c     = [[NSURLConnection alloc]initWithRequest:request delegate:self];
    self.connectionType     = ConnnectionTypePunchIn;
    [c start];
    
    if (_delegate){
        [_delegate onConnectionStart:self];
    }
    if(c) {
        NSLog(@"Connection Successful");
    } else {
        NSLog(@"Connection could not be made");
    }

}


-(void)punchOut:(NSDictionary*)employeeData
{
    NSDictionary        * postData      = @{@"endedAt":employeeData[@"endedAt"]};
    NSString            * stringURL     = [NSString stringWithFormat:@"http://zshift.herokuapp.com/api/shifts/%@",employeeData[@"_id"]];
    NSURL               * url           = [NSURL URLWithString:stringURL];
    NSMutableURLRequest * request       = [[NSMutableURLRequest alloc] initWithURL:url];
    NSError             * error         = nil;
    NSData              * requestData   =  [NSJSONSerialization dataWithJSONObject:postData options:0 error:&error];
    
    [request setHTTPMethod:@"PUT"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [request setValue:@"application/json; charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    [request setValue:[NSString stringWithFormat:@"%d", [requestData length]] forHTTPHeaderField:@"Content-Length"];
    [request setHTTPBody:requestData];
    
    NSURLConnection * c     = [[NSURLConnection alloc]initWithRequest:request delegate:self];
    self.connectionType     = ConnnectionTypePunchOut;
    [c start];
    
    if (_delegate){
        [_delegate onConnectionStart:self];
    }
    if(c) {
        NSLog(@"Connection Successful");
    } else {
        NSLog(@"Connection could not be made");
    }
}



#define mark -
#pragma mark Connection Delegate Methods

-(void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
    _collectedData  = nil;
    _data           = [[NSMutableData alloc]init];
    

}


-(void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
     [_data appendData:data];
}

-(void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    
    _collectedData = [self JSONtoDict:_data];
    
    if (_delegate){
        [_delegate onConnectionFinish:self];
    }

}


-(void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error
{
    NSLog(@"Error");
    _collectedData = nil;
    if (_delegate){
        [_delegate onConnectionError:self];
    }
}




#define mark -
#pragma mark Utility Methods



-(NSDictionary*)JSONtoDict:(NSData*)data
{
//    NSString *myString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    NSError      * error;
    NSDictionary * jsonResponse = [NSJSONSerialization JSONObjectWithData:data
                                                                 options:NSJSONReadingAllowFragments
                                                                   error:&error];
    return jsonResponse;
}

-(NSString*)DictToJSON:(NSDictionary*)dict
{
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict
                                                       options:NSJSONWritingPrettyPrinted
                                                         error:&error];
    
    if (! jsonData) {
        return @"{}";
    } else {
        return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
}


-(NSData*)imageToData:(UIImage*)image
{


    return nil;
}



@end
