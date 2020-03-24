import React, { useCallback, useEffect } from 'react'
import { FlatList, PermissionsAndroid } from 'react-native'
import Contacts from 'react-native-contacts'
import { get, orderBy, uniq } from 'lodash'
import { isAndroid } from '../../lib/utils/platform'
import { Section } from '../common'
import Separator from '../common/layout/Separator'
import InputText from '../common/form/InputText'
import { withStyles } from '../../lib/styles'
import normalize from '../../lib/utils/normalizeText'
import { getDesignRelativeHeight } from '../../lib/utils/sizes'
import userStorage from '../../lib/gundb/UserStorage'
import FeedContactItem from './FeedContactItem'

const WhoContent = ({ styles, setContact, error, text, value, next, state, showNext, setValue }) => {
  const [contacts, setContacts] = React.useState([])
  const [initialList, setInitalList] = React.useState(contacts)
  const [recentFeedItems, setRecentFeedItems] = React.useState([])
  const [recentlyUsedList, setRecentlyUsedList] = React.useState([])

  const getAllContacts = () => {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        console.warn('permissions denied')
      } else {
        const sortContacts = orderBy(contacts, ['givenName'])
        setContacts(sortContacts)
        setInitalList(sortContacts)
      }
    })
  }

  const getUserFeed = async () => {
    const userFeed = await userStorage.getFeedPage(5, true)
    const recent = userFeed.filter(({ type }) => type === 'send' || type === 'receive')
    setRecentFeedItems(recent)
  }

  const showPermissionsAndroid = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'We need access to view your contacts, so you can easily send G$ to them.',
      buttonPositive: 'Approve',
    }).then(() => {
      getAllContacts()
    })
  }

  useEffect(() => {
    getUserFeed()
  }, [])

  useEffect(() => {
    if (Contacts) {
      if (isAndroid) {
        showPermissionsAndroid()
      } else {
        getAllContacts()
      }
    }
  }, [])

  const handleSearch = useCallback(query => {
    const queryIsNumber = parseInt(query)
    if (state) {
      setValue(query)
    }
    if (query && !query.includes('+') && !query.includes('*')) {
      if (typeof queryIsNumber === 'number' && !isNaN(queryIsNumber)) {
        return setContacts(
          initialList.filter(({ phoneNumbers }) => get(phoneNumbers, '[0].number', '').indexOf(query) >= 0)
        )
      }
      if (typeof query === 'string') {
        return setContacts(
          initialList.filter(({ givenName, familyName }) => {
            const fullName = `${givenName} ${familyName}`.toLocaleLowerCase()
            return fullName.indexOf(query.toLocaleLowerCase()) >= 0
          })
        )
      }
    } else {
      getAllContacts()
    }
  })

  useEffect(() => {
    if (contacts.length === 0) {
      showNext(true)
    } else {
      showNext(false)
    }
  }, [contacts])

  useEffect(() => {
    findRecentlyUsed()
  }, [contacts, recentFeedItems])

  const findRecentlyUsed = () => {
    let matches = []
    if (recentFeedItems.length > 0 && contacts.length > 0) {
      recentFeedItems.forEach(feedItem => {
        matches.push(
          contacts.filter(
            contact => contact.phoneNumbers[0] && feedItem.data.phoneNumber === contact.phoneNumbers[0].number
          )
        )
      })
    }

    setRecentlyUsedList(matches.flat())
  }

  return (
    <>
      <Section.Stack justifyContent="space-around" style={styles.container}>
        <Section.Title fontWeight="medium">{text}</Section.Title>
        <InputText
          error={error}
          onChangeText={handleSearch}
          placeholder="Search contact name / phone"
          style={styles.input}
          value={value}
          enablesReturnKeyAutomatically
          iconName="search"
        />
      </Section.Stack>
      {recentlyUsedList.length > 0 && (
        <>
          <Section.Row justifyContent="space-between">
            <Section.Title fontWeight="medium" style={styles.sectionTitle}>
              {'Recently used'}
            </Section.Title>
            <Section.Separator style={styles.separator} width={1} />
          </Section.Row>
          <Section.Row>
            <FlatList
              data={uniq(recentlyUsedList).slice(0, 5)}
              renderItem={({ item, index }) => (
                <FeedContactItem contact={item} selectContact={setContact} horizontalMode index={index} />
              )}
              ItemSeparatorComponent={() => <Separator color={styles.separatorColor} />}
              horizontal
              contentContainerStyle={styles.recentlyUserContainer}
              scrollEnabled={false}
            />
          </Section.Row>
        </>
      )}
      {contacts.length > 0 && (
        <>
          <Section.Row justifyContent="space-between">
            <Section.Title fontWeight="medium" style={styles.sectionTitle}>
              {'Choose a Contact'}
            </Section.Title>
            <Section.Separator style={styles.separator} width={1} />
          </Section.Row>
          <Section.Stack style={styles.bottomSpace}>
            <FlatList
              data={contacts}
              renderItem={({ item, index }) => <FeedContactItem contact={item} selectContact={setContact} />}
              ItemSeparatorComponent={() => <Separator color={styles.separatorColor} />}
            />
          </Section.Stack>
        </>
      )}
    </>
  )
}

export default withStyles(({ theme }) => ({
  separatorColor: theme.colors.gray50Percent,
  sectionTitle: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.default,
    fontSize: normalize(16),
    paddingRight: 10,
  },
  separator: {
    flex: 1,
    opacity: 0.3,
  },
  recentlyUserContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  bottomSpace: {
    marginBottom: 20,
  },
  container: {
    minHeight: getDesignRelativeHeight(180),
    height: getDesignRelativeHeight(180),
  },
}))(WhoContent)
