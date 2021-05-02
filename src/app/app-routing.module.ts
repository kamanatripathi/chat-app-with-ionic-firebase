import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'searchuser',
    loadChildren: () => import('./searchuser/searchuser.module').then( m => m.SearchuserPageModule)
  },
  {
    path: 'buddychat',
    loadChildren: () => import('./buddychat/buddychat.module').then( m => m.BuddychatPageModule)
  },
  {
    path: 'todo',
    loadChildren: () => import('./todo/todo.module').then( m => m.TodoPageModule)
  },
  {
    path: 'todo-detail/:id',
    loadChildren: () => import('./todo-detail/todo-detail.module').then( m => m.TodoDetailPageModule)
  },
  {
    path: 'todo-detail',
    loadChildren: () => import('./todo-detail/todo-detail.module').then( m => m.TodoDetailPageModule)
  },
  {
    path: 'notes',
    loadChildren: () => import('./notes/notes.module').then( m => m.NotesPageModule)
  },
  {
    path: 'preview',
    loadChildren: () => import('./preview/preview.module').then( m => m.PreviewPageModule)
  },
  {
    path: 'newgroup',
    loadChildren: () => import('./newgroup/newgroup.module').then( m => m.NewgroupPageModule)
  },
  {
    path: 'newgroup/:humanObject',
    loadChildren: () => import('./newgroup/newgroup.module').then( m => m.NewgroupPageModule)
  },
  {
    path: 'channelroom',
    loadChildren: () => import('./channelroom/channelroom.module').then( m => m.ChannelroomPageModule)
  },
  {
    path: 'poll',
    loadChildren: () => import('./poll/poll.module').then( m => m.PollPageModule)
  },
  // {
  //   path:'tabs',
  //   loadChildren:()=> import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // }

  // {
  //   path: 'profile',
  //   loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  // },
  // {
  //   path: 'profile-details',
  //   loadChildren: () => import('./profile-details/profile-details.module').then( m => m.ProfileDetailsPageModule)
  // },
  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  // },
  // {
  //   path: 'chats',
  //   loadChildren: () => import('./chats/chats.module').then( m => m.ChatsPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
