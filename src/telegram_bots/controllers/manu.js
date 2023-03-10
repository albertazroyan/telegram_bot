import { title, list_demo, startText, createManu, createList, HelpHtmlText, deviceHtml } from '../config/index.js'
import { User, List, Item } from '../models/index.js'
import { takeWholeList, updateOrCreate, findID } from '../helpers/index.js'
import session from 'express-session'

export const startBotMessage = async (bot, chatId, message) => {

  // get user data
  const { first_name, last_name, id } = message.from
  const user_schema = {
    firstName: first_name,
    lastName: last_name,
    telegramId: id
  }

  const where = {
    where: { telegramId: id }
  }

  // the function helps to add or update data in the database
  await updateOrCreate(User, user_schema, where)
    .then(() => bot.sendMessage(chatId, title.start_text, startText))
    .catch(error => console.error('Failed to create a new record:', error))
}

export const createListMessage = (bot, chatId) => {
  return bot.sendMessage(chatId, title.choose_option, createManu)
}

export const addNewList = (bot, chatId) => {
  return bot.sendMessage(chatId, title.add_llist_description, createList)
}

export const addNewItem = (bot, chatId) => {
  return bot.sendMessage(chatId, title.add_item_description, createList)
}

export const todoList = (bot, chatId) => {
  if (list_demo.length === 0) {
    return bot.sendMessage(chatId, title.empty_basket, { deviceHtml })
  }
  return bot.sendMessage(chatId, title.choose_option, takeWholeList(list_demo))
}

export const viewAllList = async (bot, chatId) => {

  const where = {
    where: { telegramId: chatId }
  }

  await findID(User, where)
    .then(async res => {
      const lists = await List.findAll({ where: { userId: res } })

      if (!lists) return bot.sendMessage(chatId, title.empty_basket, { deviceHtml })

      return bot.sendMessage(chatId, title.choose_option, takeWholeList(lists))
    })
}

export const viewAllItems = async (bot, chatId) => {
  
  if (session.session.id) {
    const lists = await Item.findAll({ where: { listID: session.session.id } })

    console.warn('get all items from the specifies list:', lists)
  
  }

}

export const deleteAllList = async (bot, chatId) => {

  const where = {
    where: { telegramId: chatId }
  }
 
  await findID(User, where)
    .then(async res => {
      console.warn('all userId should be deleted', `userID: ${res}`)
      
      // const lists = await List.destroy({ where: { id: res } })
      
    })
}

export const helpUser = (bot, chatId) => {
  if (list_demo.length === 0) {
    return bot.sendMessage(chatId, HelpHtmlText, { parse_mode: 'HTML' })
  }
  return bot.sendMessage(chatId, title.choose_option, takeWholeList(list_demo))
}
