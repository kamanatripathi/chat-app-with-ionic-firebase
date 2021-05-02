import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChannelroomPage } from './channelroom.page';

const routes: Routes = [
  {
    path: '',
    component: ChannelroomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelroomPageRoutingModule {}
