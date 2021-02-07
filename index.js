'use strict';

const INSTRUMENTS_DATA_URL = 'https://randomcapital.hu/uploads/ik/basedata.json';
const INSTRUMENT_TICKER_INDEX = 0;
const INSTRUMENT_ID_INDEX = 5;

const INSTRUMENT_LIST_SELECT_ID = 'ErtekpapirList';

const INSTRUMENT_IDS_TO_SKIP = {
  36291: true
};

function makePossibleTickerIds(instrumentListSelect) {
  const possibleTickerIds = {};
  for (const option of instrumentListSelect.options) {
    possibleTickerIds[option.value] = true;
  }
  return possibleTickerIds;
}

function makeTickerIdsFromInstruments(instruments, possibleTickerIds) {
  const tickerIds = {};
  for (const instrument of instruments) {
    const tickerId = instrument[INSTRUMENT_ID_INDEX];
    if (!possibleTickerIds[tickerId] || INSTRUMENT_IDS_TO_SKIP[tickerId]) {
      continue;
    }

    const ticker = instrument[INSTRUMENT_TICKER_INDEX].toLowerCase();
    if (tickerIds[ticker]) {
      console.error(`Random Capital Netboon Instrument Searcher: Not handled duplicated ticker: ${ticker}`);
    }
    tickerIds[ticker] = tickerId;
  }
  return tickerIds;
}

function onTicketSearcherChange(instrumentListSelect, tickerIds, event) {
  const ticker = event.srcElement.value.toLowerCase();

  const id = tickerIds[ticker];
  if (id) {
    instrumentListSelect.value = id;
  } else {
    instrumentListSelect.selectedIndex = 0;
  }
}

function createTickerSearcherInput(instrumentListSelect, tickerIds) {
  const input = document.createElement('input');
  input.style = 'margin-top: 5px; display: block;';
  input.oninput = onTicketSearcherChange.bind(null, instrumentListSelect, tickerIds);

  instrumentListSelect.parentNode.insertBefore(input, instrumentListSelect.nextSibling);
}

const instrumentListSelect = document.getElementById(INSTRUMENT_LIST_SELECT_ID);
if (instrumentListSelect) {
  chrome.runtime.sendMessage({
      url: INSTRUMENTS_DATA_URL,
    }, (res) => {
      if (!res) {
        return;
      }

      const possibleTickerIds = makePossibleTickerIds(instrumentListSelect);
      const tickerIds = makeTickerIdsFromInstruments(res.data, possibleTickerIds);

      createTickerSearcherInput(instrumentListSelect, tickerIds);
    }
  );
}
