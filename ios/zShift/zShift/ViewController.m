//
//  ViewController.m
//  zShift
//
//  Created by Atomicflare on 2015-07-18.
//
//

#import "ViewController.h"

@interface ViewController ()

@end



@implementation ViewController
{
    NSMutableArray * shiftList;

}

@synthesize serverManager = _serverManager;






- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    _serverManager  = [[ServerManager alloc]init];
    shiftList       = [[NSMutableArray alloc]init];
    
    _serverManager.delegate = self;
    

    [_serverManager authenticate:@"gautam@gaut.am" password:@"password"];
  
//    [self startPoseForShift];
    
//    [self performSelector:@selector(startPoseForShift) withObject:nil afterDelay:5];
}



-(void)startPoseForShift
{

    UIImagePickerController *imagePickerController = [[UIImagePickerController alloc] init];
    imagePickerController.modalPresentationStyle = UIModalPresentationCurrentContext;
    imagePickerController.sourceType = UIImagePickerControllerSourceTypeCamera;
    imagePickerController.delegate = self;
    
    
    imagePickerController.showsCameraControls = YES;
        /*
         Load the overlay view from the OverlayView nib file. Self is the File's Owner for the nib file, so the overlayView outlet is set to the main view in the nib. Pass that view to the image picker controller to use as its overlay view, and set self's reference to the view to nil.
         */
//    [[NSBundle mainBundle] loadNibNamed:@"OverlayView" owner:self options:nil];
//    self.overlayView.frame = imagePickerController.cameraOverlayView.frame;
//    imagePickerController.cameraOverlayView = self.overlayView;
//    self.overlayView = nil;
//
// imagePickerController.cameraOverlayView = self.view;
    
    //
    self.imagePickerController = imagePickerController;
    [self presentViewController:self.imagePickerController animated:YES completion:nil];



}



- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#define mark -
#pragma mark Delegate Methods

-(void)onConnectionStart:(ServerManager*)serverManager
{

}

-(void)onConnectionFinish:(ServerManager*)serverManager
{
    switch (serverManager.connectionType) {

        case ConnnectionTypeAuthentication:
            if ([serverManager.collectedData count] > 1) {
                [serverManager pullAllShifts];
            } else {
                NSLog(@"User login is incorrect");
            }
            break;

        case ConnnectionTypePunchIn:
            
            break;

        case ConnnectionTypePunchOut:
            
            break;

        case ConnnectionTypeGetAllShifts:
            
            if ([serverManager.collectedData isKindOfClass:[NSArray class]]){
            [self buildShifts:(NSArray*)serverManager.collectedData];
            }
            
            
            break;
            
        default:
            break;
    }
    
    
}


-(void)buildShifts:(NSArray*)list
{

    for (NSDictionary * dict in list) {

        Shift * shift = [[Shift alloc]initWithDict:dict];
        [shiftList addObject:shift];
    }
    
    
    // reload table
    
}



-(void)onConnectionError:(ServerManager*)serverManager
{


}




@end
