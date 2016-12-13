
import PageTitle from './../../common/PageTitle/index';
import ModalDropdown from 'react-native-modal-dropdown';
import MyAccount from './myAccount';
var Modal   = require('react-native-modalbox');


export default class Demo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            swipeToClose:true,
            selected_title:'选择大区',
            selected_area_id:'',
            keyword:'',
            area_list:[],
            is_bind:false,
            qquin:'',
            area_id:'',
        };

        this._getAreaList();

        setTimeout(()=>{
            this.openModal();
        },500);
    }

    openModal = ()=>{
        this.refs.modal.open();
    }

    closeModal =()=>{
        this.refs.modal.close();
    }


    /**
     * 获取LOL大区列表
     * @private
     */
    _getAreaList = ()=>{
        let fetchUtil = new FetchUtil();
        fetchUtil.init()
            .setUrl(URL.LOL_AREA)
            .setMethod('GET')
            .setHeader({
                'DAIWAN-API-TOKEN':KEY.LOL_API_KEY
            })
            .dofetch()
            .then((data)=>{
                let area_arr = [];

                for(let item of data.data){
                    area_arr.push(item.name);
                }

                this.setState({
                    area_list:area_arr,
                });
            })
            .catch((error)=>{
                alert('error:'+error);
            })
    }

    /**
     * 选中大区
     * @param index
     * @param value
     * @private
     */
    _handleSelected=(index,value)=>{
        this.setState({
            selected_title:value,
            selected_area_id:index,
        });
    }

    _handleSure = ()=>{
        if(this.state.selected_area_id&&this.state.keyword){
            let fetchUtil = new FetchUtil();
            fetchUtil.init()
                .setUrl(URL.LOL_USER_AREA+"?keyword="+this.state.keyword)
                .setMethod('GET')
                .setHeader({
                    'DAIWAN-API-TOKEN':KEY.LOL_API_KEY
                })
                .dofetch()
                .then((data)=>{
                    let res = data.data;
                    let isExist = false;
                    for(let i of res){
                        if(i.area_id==(parseInt(this.state.selected_area_id)+1)&&i.name==this.state.keyword){
                            //展现数据
                            this.setState({
                                qquin:i.qquin,
                                area_id:i.area_id,
                                is_bind:true
                            });
                            isExist = true;
                            break;
                        }
                    }
                    if(!isExist){
                        ToastAndroid.show("没找到该账户信息哦~~",ToastAndroid.SHORT);
                    }
                })
                .catch((error)=>{
                    alert('error:'+error);
                })
            //this.refs.modal.close();
        }
        else {
            ToastAndroid.show('请选择ID和大区',ToastAndroid.SHORT);
        }
    }

    render() {
        if(!this.state.is_bind){
            return (
                <View style={{flex:1}}>
                    <PageTitle title="我的账户" navigator={this.props.navigator} showBack={false}/>
                    <View style={{flex:1}}>
                        <Modal
                            position='center'
                            style={styles.modal}
                            ref={"modal"}
                            swipeToClose={this.state.swipeToClose}
                            onOpened={this.onOpen}
                            onClosingState={this.onClosingState}
                            backdropOpacity={0.1}
                            backdropContent={<Text></Text>}
                            animationDuration={800}
                            backdropPressToClose={false}
                            entry="top"
                        >
                            <View style={{flex:1}}>

                                <View style={{flexDirection:'column',height:130}}>

                                    <View style={{flex:1,margin:5}}>
                                        <View style={{backgroundColor: '#f9f5ed',borderWidth:1,borderRadius:5,borderColor:'#d4d4d3'}}>
                                            <TextInput
                                                placeholder="游戏ID"
                                                style={{color:'#91627b',fontSize:18,fontWeight:'bold',textAlign:'center'}}
                                                underlineColorAndroid="transparent"
                                                onChangeText={(text)=>{
                                                    this.setState({
                                                        keyword:text
                                                    });
                                                }}
                                            ></TextInput>
                                        </View>
                                    </View>

                                    <View style={{flex:1,margin:5}}>
                                        <ModalDropdown
                                            options={this.state.area_list}
                                            dropdownStyle={{backgroundColor:'#f9f5ed',flex:1,width:SceneWidth-10,alignItems:'center',justifyContent:'center'}}
                                            onSelect={this._handleSelected}
                                            textStyle={{fontSize:20}}
                                        >
                                            <View style={{backgroundColor: '#f9f5ed',borderWidth:1,borderRadius:5,borderColor:'#d4d4d3',height:50,justifyContent:'center'}}>
                                                <Text style={{color:'#91627b',fontSize:18,fontWeight:'bold',textAlign:'center'}}>{this.state.selected_title}</Text>
                                            </View>
                                        </ModalDropdown>
                                    </View>

                                </View>

                                <View style={{alignItems:'center',margin:10}}>
                                    <View style={{width:300,height:50,alignItems:'center',backgroundColor:'#6bbb58',justifyContent:'center',borderRadius:10}}>
                                        <TouchableOpacity onPress={()=>{this._handleSure()}}><Text style={{fontSize:25,color:'#fff'}}>绑定</Text></TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                        </Modal>
                    </View>
                </View>
            );
        }
        else {
            //成功绑定
            return (
                <View style={{flex:1}}>
                    <PageTitle title="我的账户" navigator={this.props.navigator} showBack={false}/>
                    <View style={{flex:1}}>
                        <MyAccount qquin={this.state.qquin} area_id={this.state.area_id} navigator={this.props.navigator}/>
                    </View>
                </View>
            );
        }

    }


}
var styles = StyleSheet.create({

    wrapper: {
        paddingTop: 50,
        flex: 1
    },

    modal: {
        height:200,
        borderRadius:5,
    },
    btn: {
        margin: 10,
        backgroundColor: "#3B5998",
        padding: 10
    },

    btnModal: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 50,
        height: 50,
        backgroundColor: "transparent"
    },

    text: {
        fontSize: 22
    }

});