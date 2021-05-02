import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChannelroomPageRoutingModule } from './channelroom-routing.module';

import { ChannelroomPage } from './channelroom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChannelroomPageRoutingModule
  ],
  declarations: [ChannelroomPage]
})
export class ChannelroomPageModule {}
