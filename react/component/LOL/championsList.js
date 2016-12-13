/**
 * 英雄列表
 * Created by fangzhen on 2016/11/21.
 */

import ChampionInfo from './championInfo';
import LoadingPage from './../../common/LoadingPage/index';
import PageTitle from './../../common/PageTitle/index';
import SearchInput from './../../common/SearchInput/index';

export default class ChampionList extends Component{

    constructor(props){
        super(props);
        this.state = {
            data:[],
            dataSource:new ListView.DataSource({
                rowHasChanged:(a,b)=>a!==b,
            }),
            loaded:false,
            search_data:[],
        }
        setTimeout(function () {
            this._getData();
        }.bind(this),100);

    }

    /**
     * 获取英雄列表数据
     * @private
     */
    _getData(){
        fetch(URL.LOL_CHAMPION,{
            method:'GET',
            headers:{
                'DAIWAN-API-TOKEN':KEY.LOL_API_KEY
            }
        }).then((res)=>res.json())
            .then((data)=>{
                //需要将数据分组
                    var res = [];
                    for(var i in data.data){
                        var temp = [];
                        if(data.data[i*2+1]){
                            temp.push(data.data[i*2],data.data[i*2+1]);
                            res.push(temp);
                        }else if(data.data[i*2]){
                            temp.push(data.data[i*2]);
                            res.push(temp);
                        }
                    }
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(res),
                        loaded:true,
                    });

            })
            .catch((error)=>{
                console.log(error.message);
            });
    }

    /**
     * 搜索英雄
     * @private
     */
    _handleClick(keyword){
        if(keyword==''||keyword==null){
            this.setState({
                search_data:[],
            });
            ToastAndroid.show('搜索内容不能为空',ToastAndroid.SHORT);
        }
        else {
            let fetchUtil = new FetchUtil();
            fetchUtil.init()
                .setUrl(URL.LOL_SEARCH_CHAMPION+'?keyword='+keyword)
                .setMethod('GET')
                .setOvertime(30 * 1000)
                .dofetch()
                .then((data) => {
                    this.setState({
                        search_data:data,
                    });
                })
                .catch((error) => {
                    console.log('=> catch: ', error);
                });
        }
    }

    /**
     *
     * @param item
     * @returns {XML}
     * @private
     */
    _renderChampionList = (item)=>{
        if(item[1]){
            var viewOut = (
                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1}}>
                        <TouchableOpacity onPress={()=>{
                            this.props.navigator.push({name:'championInfo',component:ChampionInfo,param:{id:item[0].id,navigator:this.props.navigator}});
                        }}>
                            <View style={{flex:1,flexDirection:'row'}}>
                                <View>
                                    <Image source={{uri:'http://cdn.tgp.qq.com/pallas/images/champions_id/'+item[0].id+'.png'}} style={styles.img}/>
                                </View>

                                <View style={styles.title}>
                                    <Text>{item[0].title}</Text>
                                    <Text style={styles.small_txt}>{item[0].cname}</Text>
                                </View>

                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex:1}}>
                        <TouchableOpacity onPress={()=>{
                            this.props.navigator.push({name:'championInfo',component:ChampionInfo,param:{id:item[1].id,navigator:this.props.navigator}});
                        }}>
                            <View style={{flex:1,flexDirection:'row'}}>
                                <View>
                                    <Image source={{uri:'http://cdn.tgp.qq.com/pallas/images/champions_id/'+item[1].id+'.png'}} style={styles.img}/>
                                </View>

                                <View style={styles.title}>
                                    <Text>{item[1].title}</Text>
                                    <Text style={styles.small_txt}>{item[1].cname}</Text>
                                </View>

                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        else {
            var viewOut = (
                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1}}>
                        <TouchableOpacity onPress={()=>{
                            this.props.navigator.push({name:'championInfo',component:ChampionInfo,param:{id:item[0].id,navigator:this.props.navigator}});
                        }}>
                            <View style={{flex:1,flexDirection:'row'}}>
                                <View>
                                    <Image source={{uri:'http://cdn.tgp.qq.com/pallas/images/champions_id/'+item[0].id+'.png'}} style={styles.img}/>
                                </View>

                                <View style={styles.title}>
                                    <Text>{item[0].title}</Text>
                                    <Text style={styles.small_txt}>{item[0].cname}</Text>
                                </View>

                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        return(
            <View>
                {viewOut}
            </View>
        );

    }


    _renderSearchRow=(item)=>{
        return (
            <View style={{flex:1,flexDirection:'row'}}>
                <View style={{flex:1}}>
                    <TouchableOpacity onPress={()=>{
                        this.props.navigator.push({name:'championInfo',component:ChampionInfo,param:{id:item.champion_id,navigator:this.props.navigator}});
                    }}>
                        <View style={{flex:1,flexDirection:'row'}}>
                            <View>
                                <Image source={{uri:'http://cdn.tgp.qq.com/pallas/images/champions_id/'+item.champion_id+'.png'}} style={styles.img}/>
                            </View>

                            <View style={styles.title}>
                                <Text>{item.title}</Text>
                                <Text style={styles.small_txt}>{item.cname}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        if (!this.state.loaded) {
            return <LoadingPage title="英雄加载中..."/>
        }
        if(this.state.search_data.length){
            var search_view = [];
            this.state.search_data.map((item,i)=>{
                search_view.push(
                    <View style={{flex:1,flexDirection:'row'}} key={i}>
                        <View style={{flex:1}}>
                            <TouchableOpacity onPress={()=>{
                                this.props.navigator.push({name:'championInfo',component:ChampionInfo,param:{id:item.champion_id,navigator:this.props.navigator}});
                            }}>
                                <View style={{flex:1,flexDirection:'row'}}>
                                    <View>
                                        <Image source={{uri:'http://cdn.tgp.qq.com/pallas/images/champions_id/'+item.champion_id+'.png'}} style={styles.img}/>
                                    </View>

                                    <View style={styles.title}>
                                        <Text>{item.title}</Text>
                                        <Text style={styles.small_txt}>{item.cname}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            });

            return (
                <View style={{flex: 1}}>
                    <PageTitle title="英雄列表" navigator={this.props.navigator} showBack={false}/>
                    <SearchInput
                        onClick={(text)=>this._handleClick(text)}
                        placeholder='搜索英雄'
                    />
                    <ScrollView>
                        {search_view}
                    </ScrollView>
                </View>
            );
        }
        else {
            return (
                <View style={{flex: 1}}>
                    <PageTitle title="英雄列表" navigator={this.props.navigator} showBack={false}/>
                    <SearchInput
                        onClick={(text)=>this._handleClick(text)}
                        placeholder='搜索英雄'
                    />
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderChampionList}
                        initialListSize={20}
                        pageSize={20}>
                    </ListView>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    img:{
        width:60,
        height:60,
        margin:10,
    },
    title:{
        flex:1,
        flexDirection:'column',
        justifyContent:'space-around'
    },
    small_txt:{
        fontSize:12,
        color:'#988f8e'
    }
});