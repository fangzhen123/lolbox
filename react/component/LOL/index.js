/**
 * Created by fangzhen on 2016/11/15.
 */

import SearchUser from './SearchUser';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustomTabBar from './../../common/TabBar/index';
import ChampionList from './championsList';
import MyDetail from './myDetail';

var tabNames = ['英雄','查询','撸点','我'];
var tabIconNames = ['legal','search','compass','user'];

export default class Index extends Component{

    render(){
        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>
                <View style={{flex:1}}>
                    <ScrollableTabView
                        renderTabBar={() => <CustomTabBar tabNames={tabNames} tabIconNames={tabIconNames}/>}
                        tabBarPosition='bottom'
                    >
                        <View style={{flex:1}}><ChampionList navigator={this.props.navigator}/></View>
                        <View style={{flex:1}}><SearchUser navigator={this.props.navigator}/></View>
                        <View style={{flex:1}}><WebView source={{uri:'http://bbs.duowan.com/forum-2376-1.html'}}></WebView></View>
                        <View style={{flex:1}}><MyDetail navigator={this.props.navigator}/></View>
                    </ScrollableTabView>
                </View>

            </View>
        );
    }
}
