// @flow
import React from 'react'
import { Image, Platform, View } from 'react-native'
import receiveIllustation from '../../../assets/Feed/receive.svg'
import sendIllustration from '../../../assets/Feed/send.svg'
import messageIllustration from '../../../assets/Feed/message.png'
import inviteIllustration from '../../../assets/Feed/invite.png'
import inviteFriendsIllustration from '../../../assets/Feed/inviteFriends.png'
import backupIllustration from '../../../assets/Feed/backup.png'
import spendingIllustration from '../../../assets/Feed/spending.svg'
import claimingIllustration from '../../../assets/Feed/claiming.svg'
import hanukaStartsIllustration from '../../../assets/Feed/hanukaStarts.svg'
import ReceivedAnimation from '../../common/animations/Received'
import SendAnimation from '../../common/animations/Send'
import { withStyles } from '../../../lib/styles'
import { getDesignRelativeHeight, getDesignRelativeWidth } from '../../../lib/utils/sizes'

const mainPhotoStyle = {
  web: {
    height: '20vh',
    width: '100%',
  },
  ios: {
    height: getDesignRelativeHeight(175, true),
    width: '100%',
  },
  android: {
    height: getDesignRelativeHeight(175, true),
    width: '100%',
  },
}

export const getImageByType = (type, styles = {}) =>
  ({
    withdraw: {
      animationComponent: ReceivedAnimation,
      animation: true,
      containerStyle: styles.mainImageContainer,
    },
    sendcompleted: {
      animationComponent: SendAnimation,
      animation: true,
      containerStyle: styles.mainImageContainer,
    },
    claim: {
      animationComponent: ReceivedAnimation,
      animation: true,
      containerStyle: styles.mainImageContainer,
    },
    claiming: {
      src: claimingIllustration,
      style: styles.claiming,
      containerStyle: styles.mainImageContainer,
    },
    bonuscompleted: {
      animationComponent: ReceivedAnimation,
      animation: true,
      containerStyle: styles.mainImageContainer,
    },
    receive: {
      src: receiveIllustation,
      style: styles.mainImage,
      containerStyle: styles.mainImageContainer,
    },
    send: {
      src: sendIllustration,
      style: styles.mainImage,
      containerStyle: styles.mainImageContainer,
    },
    message: {
      src: messageIllustration,
      style: styles.mainPhoto,
      containerStyle: styles.mainPhotoContainer,
    },
    invite: {
      src: inviteFriendsIllustration,
      style: styles.mainPhoto,
      containerStyle: styles.mainPhotoContainer,
    },
    welcome: {
      src: inviteIllustration,
      style: styles.mainPhoto,
      containerStyle: styles.mainPhotoContainer,
    },
    backup: {
      src: backupIllustration,
      style: styles.mainPhoto,
      containerStyle: styles.mainPhotoContainer,
    },
    spending: {
      src: spendingIllustration,
      style: styles.spending,
      containerStyle: styles.mainPhotoContainer,
    },
    hanukaStarts: {
      src: hanukaStartsIllustration,
      style: styles.hanukaStarts,
      containerStyle: styles.mainImageContainer,
    },
  }[type] || null)

const TopImage = ({ type, styles }) => {
  const image = getImageByType(type, styles)
  if (image) {
    return image.animation ? (
      <View style={image.containerStyle}>
        <image.animationComponent />
      </View>
    ) : (
      <View style={image.containerStyle}>
        <Image style={image.style} source={image.src} />
      </View>
    )
  }

  return null
}

const getStylesFromProps = ({ theme }) => ({
  mainImageContainer: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 15,
  },
  mainImage: {
    height: getDesignRelativeHeight(110, true),
    width: getDesignRelativeWidth(70, true),
  },
  mainPhotoContainer: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: -theme.sizes.defaultDouble,
    marginTop: -theme.sizes.defaultDouble,
    marginBottom: 15,
  },
  mainPhoto: Platform.select(mainPhotoStyle),
  spending: {
    width: getDesignRelativeWidth(176),
    height: getDesignRelativeHeight(76),
    margin: '10%',
  },
  claiming: {
    width: getDesignRelativeHeight(92),
    height: getDesignRelativeHeight(92),
    margin: 20,
  },
  hanukaStarts: {
    width: getDesignRelativeHeight(190),
    height: getDesignRelativeHeight(115),
    margin: 10,
  },
})

export default withStyles(getStylesFromProps)(TopImage)
