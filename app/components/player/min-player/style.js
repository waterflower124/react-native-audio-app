import { COLORS, METRICS, FONTS } from '../../../themes';

const styles = {
    container: {
        flex: 1,
        position: "absolute",
        bottom: 0,
        padding: 15,
        width: "100%",
        height: 90,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundColor
    },
    actions:{
        flex: 1,
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionsRight:{
        flexDirection: 'row',
    },
    picture:{
        width: 50,
        height: 50,
        borderWidth:0,
        borderRadius: 8,
        backgroundColor: COLORS.emptyColor,
    },
    title: {
        color: COLORS.text.white,
        fontSize: 15,
        fontFamily: FONTS.type.Medium,
    },
    name: {
        color: COLORS.text.primary,
        fontSize: 14,
        fontFamily: FONTS.type.Medium,

    },
    icon:{
        color: COLORS.text.white,
        paddingRight: 15
    },
    containerInfo:{
        margin: 15,
        marginTop:0,
        marginBottom: 10,
        title:{
            color: COLORS.text.white,
            fontSize: 15,
            fontFamily: FONTS.type.Medium,
        }
    }

}
export default styles
