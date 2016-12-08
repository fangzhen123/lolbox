/**
 * 玩家熟练度
 * Created by fangzhen on 2016/12/8.
 */
import PageTitle from './../../common/PageTitle/index';
import LoadingPage from './../../common/LoadingPage/index';
import UserInfo from './userInfo';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ChampionRankList extends Component{

    constructor(props){
        super(props);
        this.state = {
            rank_data:[],
            dataSource:new ListView.DataSource({
                rowHasChanged:(a,b)=>a!==b,
            }),
            page:1,
            loaded:false
        }

        setTimeout(()=>{
            this._getRankData();
        },300);

        this._renderRow = this._renderRow.bind(this);
    }

    /**
     * 获取熟练度排行
     * @private
     */
    _getRankData(){
        let fetchUtil = new FetchUtil();
        fetchUtil.init()
            .setUrl(URL.LOL_CHAMPION_RANK+'?championid='+this.props.champion_id+'&p='+this.state.page)
            .setMethod('GET')
            .setOvertime(30 * 1000)
            .setHeader({
                'DAIWAN-API-TOKEN':KEY.LOL_API_KEY
            })
            .dofetch()
            .then((data) => {
                let newData = this.state.rank_data.concat(data.data[0].skillRank);
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(newData),
                    rank_data:newData,
                    loaded:true,
                });
            })
            .catch((error) => {
                console.log('=> catch: ', error);
            });
    }


    _renderRow(item){
        return (
            <View style={{flex:1}}>
                <TouchableOpacity style={styles.row} onPress={()=>{
                    this.props.navigator.push({name:'userInfo',component:UserInfo,param:{qquin:item.uin,area_id:item.area_id}});
                }}>
                    <View style={{flex:1}}>
                        <Image source={{uri:URL.LOL_USER_ICON_URL+item.iconId+'.png'}} style={styles.icon_img}></Image>
                    </View>

                    <View style={{flex:3,flexDirection:'column',justifyContent:'center'}}>

                        <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                            <View style={styles.icon_style}>
                                <Icon name="paper-plane" size={10}/>
                            </View>
                            <View>
                                <Text style={styles.name_style}>{item.uName}</Text>
                            </View>
                        </View>

                        <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                            <View style={styles.icon_style}>
                                <Icon name="map-marker" size={12}/>
                            </View>
                            <View>
                                <Text style={styles.text_style}>{item.areaName}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                        <Icon name="line-chart" size={15} color="#e69138"/>
                        <Text style={{marginLeft:5,color:'#6aa84f'}}>{item.cevValue}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render(){
        if(!this.state.loaded){
            return (
                <LoadingPage title="加载中..."/>
            );
        }
        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>
                <PageTitle title="熟练度排行榜" navigator={this.props.navigator}/>
                <View>
                    <Image source={{uri:'http://cdn.tgp.qq.com/pallas/images/skins/original/'+this.props.champion_id+'-000.jpg'}} style={{width:SceneWidth,height:150}}>
                    </Image>
                </View>

                <View style={{flex:1}}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        onEndReached={()=>{
                            let page = this.state.page+1;
                            this.setState({
                                page:page,
                            },()=>{
                                this._getRankData();
                            });
                        }}
                    />
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    row:{
        borderBottomWidth:1,
        flex:1,
        flexDirection:'row',
        margin:2,
        borderColor:'#d4d4d3',
        padding:5,
    },
    level_style:{
        backgroundColor:'#f7ac46',
        width:20,
        height:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:2,
    },
    level_title:{
        fontSize:10,
        color:'#fff',
    },
    icon_img:{
        width:60,
        height:60,
        borderRadius:3
    },
    icon_style:{
        width:10,
        height:10,
        alignItems:'center',
        justifyContent:'center',
        marginRight:5
    },
    text_style:{
        fontSize:12,
    },
    name_style:{
        fontWeight:'bold',
    },
    search_history:{
        height:40,
        borderBottomWidth:1,
        borderBottomColor:'#e8dfdd',
        justifyContent:'center',
        paddingLeft:20,
    },
    search_history_tips:{
        alignItems:'center',
        backgroundColor:'#fdf5f5',
        margin:5,
    }
});