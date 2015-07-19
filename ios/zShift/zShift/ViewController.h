//
//  ViewController.h
//  zShift
//
//  Created by Atomicflare on 2015-07-18.
//
//

#import <UIKit/UIKit.h>
#import "ServerManager.h"
#import "Shift.h"

@interface ViewController : UIViewController <ServerManagerConnectionDelegate,UINavigationControllerDelegate,UIImagePickerControllerDelegate>




@property (nonatomic,weak) IBOutlet UIButton * login;


@property (nonatomic,strong) ServerManager * serverManager;
@property (nonatomic) UIImagePickerController *imagePickerController;



@end

