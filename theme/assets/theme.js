window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};

theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    this.instances = _.filter(this.instances, function(instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(
      function(index, container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  }
});

window.slate = window.slate || {};

/**
 * Slate utilities
 * -----------------------------------------------------------------------------
 * A collection of useful utilities to help build your theme
 *
 *
 * @namespace utils
 */

slate.utils = {
  /**
   * Get the query params in a Url
   * Ex
   * https://mysite.com/search?q=noodles&b
   * getParameterByName('q') = "noodles"
   * getParameterByName('b') = "" (empty value)
   * getParameterByName('test') = null (absent)
   */
  getParameterByName: function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  },

  resizeSelects: function($selects) {
    $selects.each(function() {
      var $this = $(this);
      var arrowWidth = 10;
      // create test element
      var text = $this.find('option:selected').text();
      var $test = $('<span>').html(text);

      // add to body, get width, and get out
      $test.appendTo('body');
      var width = $test.width();
      $test.remove();

      // set select width
      $this.width(width + arrowWidth);
    });
  },

  keyboardKeys: {
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    LEFTARROW: 37,
    RIGHTARROW: 39
  }
};

window.slate = window.slate || {};

/**
 * iFrames
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace iframes
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    options.$tables.wrap(
      '<div class="' + options.tableWrapperClass + '"></div>'
    );
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + options.iframeWrapperClass + '"></div>');

      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

window.slate = window.slate || {};

/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {
  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element
      .first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element
        .first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on(
      'click',
      function(evt) {
        this.pageLinkFocus($(evt.currentTarget.hash));
      }.bind(this)
    );
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventsName = {
      focusin: options.namespace ? 'focusin.' + options.namespace : 'focusin',
      focusout: options.namespace
        ? 'focusout.' + options.namespace
        : 'focusout',
      keydown: options.namespace
        ? 'keydown.' + options.namespace
        : 'keydown.handleFocus'
    };

    /**
     * Get every possible visible focusable element
     */
    var $focusableElements = options.$container.find(
      $(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
      ).filter(':visible')
    );
    var firstFocusable = $focusableElements[0];
    var lastFocusable = $focusableElements[$focusableElements.length - 1];

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    function _manageFocus(evt) {
      if (evt.keyCode !== slate.utils.keyboardKeys.TAB) return;

      /**
       * On the last focusable element and tab forward,
       * focus the first element.
       */
      if (evt.target === lastFocusable && !evt.shiftKey) {
        evt.preventDefault();
        firstFocusable.focus();
      }
      /**
       * On the first focusable element and tab backward,
       * focus the last element.
       */
      if (evt.target === firstFocusable && evt.shiftKey) {
        evt.preventDefault();
        lastFocusable.focus();
      }
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).off('focusin');

    $(document).on(eventsName.focusout, function() {
      $(document).off(eventsName.keydown);
    });

    $(document).on(eventsName.focusin, function(evt) {
      if (evt.target !== lastFocusable && evt.target !== firstFocusable) return;

      $(document).on(eventsName.keydown, function(evt) {
        _manageFocus(evt);
      });
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  },

  /**
   * Add aria-describedby attribute to external and new window links
   *
   * @param {object} options - Options to be used
   * @param {object} options.messages - Custom messages to be used
   * @param {jQuery} options.$links - Specific links to be targeted
   */
  accessibleLinks: function(options) {
    var body = document.querySelector('body');

    var idSelectors = {
      newWindow: 'a11y-new-window-message',
      external: 'a11y-external-message',
      newWindowExternal: 'a11y-new-window-external-message'
    };

    if (options.$links === undefined || !options.$links.jquery) {
      options.$links = $('a[href]:not([aria-describedby])');
    }

    function generateHTML(customMessages) {
      if (typeof customMessages !== 'object') {
        customMessages = {};
      }

      var messages = $.extend(
        {
          newWindow: 'Opens in a new window.',
          external: 'Opens external website.',
          newWindowExternal: 'Opens external website in a new window.'
        },
        customMessages
      );

      var container = document.createElement('ul');
      var htmlMessages = '';

      for (var message in messages) {
        htmlMessages +=
          '<li id=' + idSelectors[message] + '>' + messages[message] + '</li>';
      }

      container.setAttribute('hidden', true);
      container.innerHTML = htmlMessages;

      body.appendChild(container);
    }

    function _externalSite($link) {
      var hostname = window.location.hostname;

      return $link[0].hostname !== hostname;
    }

    $.each(options.$links, function() {
      var $link = $(this);
      var target = $link.attr('target');
      var rel = $link.attr('rel');
      var isExternal = _externalSite($link);
      var isTargetBlank = target === '_blank';

      if (isExternal) {
        $link.attr('aria-describedby', idSelectors.external);
      }
      if (isTargetBlank) {
        if (rel === undefined || rel.indexOf('noopener') === -1) {
          $link.attr('rel', function(i, val) {
            var relValue = val === undefined ? '' : val + ' ';
            return relValue + 'noopener';
          });
        }
        $link.attr('aria-describedby', idSelectors.newWindow);
      }
      if (isExternal && isTargetBlank) {
        $link.attr('aria-describedby', idSelectors.newWindowExternal);
      }
    });

    generateHTML(options.messages);
  }
};

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

theme.Images = (function() {
  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Swaps the src of an image for another OR returns the imageURL to the callback function
   * @param image
   * @param element
   * @param callback
   */
  function switchImage(image, element, callback) {
    var size = this.imageSize(element.src);
    var imageUrl = this.getSizedImageUrl(image.src, size);

    if (callback) {
      callback(imageUrl, image, element); // eslint-disable-line callback-return
    } else {
      element.src = imageUrl;
    }
  }

  /**
   * +++ Useful
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(
      /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/
    );

    if (match !== null) {
      if (match[2] !== undefined) {
        return match[1] + match[2];
      } else {
        return match[1];
      }
    } else {
      return null;
    }
  }

  /**
   * +++ Useful
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(
      /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
    );

    if (match !== null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    }

    return null;
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    switchImage: switchImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function() {
  var moneyFormat = '${{amount}}'; // eslint-disable-line camelcase

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        '$1' + thousands
      );
      var centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist.  Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {
  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on(
      'change',
      this._onSelectChange.bind(this)
    );
  }

  Variants.prototype = _.assignIn({}, Variants.prototype, {
    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = _.map(
        $(this.singleOptionSelector, this.$container),
        function(element) {
          var $element = $(element);
          var type = $element.attr('type');
          var currentOption = {};

          if (type === 'radio' || type === 'checkbox') {
            if ($element[0].checked) {
              currentOption.value = $element.val();
              currentOption.index = $element.data('index');

              return currentOption;
            } else {
              return false;
            }
          } else {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          }
        }
      );

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = _.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;

      var found = _.find(variants, function(variant) {
        return selectedValues.every(function(values) {
          return _.isEqual(variant[values.index], values.value);
        });
      });

      return found;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this._updateSKU(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (
        !variant.featured_image ||
        variantImage.src === currentVariantImage.src
      ) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (
        variant.price === this.currentVariant.price &&
        variant.compare_at_price === this.currentVariant.compare_at_price
      ) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant sku changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantSKUChange
     */
    _updateSKU: function(variant) {
      if (variant.sku === this.currentVariant.sku) {
        return;
      }

      this.$container.trigger({
        type: 'variantSKUChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?variant=' +
        variant.id;
      window.history.replaceState({ path: newurl }, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container).val(variant.id);
    }
  });

  return Variants;
})();

this.Shopify = this.Shopify || {};
this.Shopify.theme = this.Shopify.theme || {};
this.Shopify.theme.PredictiveSearch = (function() {
  'use strict';

  function validateQuery(query) {
    var error;

    if (query === null || query === undefined) {
      error = new TypeError("'query' is missing");
      error.type = 'argument';
      throw error;
    }

    if (typeof query !== 'string') {
      error = new TypeError("'query' is not a string");
      error.type = 'argument';
      throw error;
    }
  }

  function GenericError() {
    var error = Error.call(this);

    error.name = 'Server error';
    error.message = 'Something went wrong on the server';
    error.status = 500;

    return error;
  }

  function NotFoundError(status) {
    var error = Error.call(this);

    error.name = 'Not found';
    error.message = 'Not found';
    error.status = status;

    return error;
  }

  function ServerError() {
    var error = Error.call(this);

    error.name = 'Server error';
    error.message = 'Something went wrong on the server';
    error.status = 500;

    return error;
  }

  function ContentTypeError(status) {
    var error = Error.call(this);

    error.name = 'Content-Type error';
    error.message = 'Content-Type was not provided or is of wrong type';
    error.status = status;

    return error;
  }

  function JsonParseError(status) {
    var error = Error.call(this);

    error.name = 'JSON parse error';
    error.message = 'JSON syntax error';
    error.status = status;

    return error;
  }

  function ThrottledError(status, name, message, retryAfter) {
    var error = Error.call(this);

    error.name = name;
    error.message = message;
    error.status = status;
    error.retryAfter = retryAfter;

    return error;
  }

  function InvalidParameterError(status, name, message) {
    var error = Error.call(this);

    error.name = name;
    error.message = message;
    error.status = status;

    return error;
  }

  function ExpectationFailedError(status, name, message) {
    var error = Error.call(this);

    error.name = name;
    error.message = message;
    error.status = status;

    return error;
  }

  function request(configParams, query, onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== XMLHttpRequest.DONE) {
        return;
      }

      var contentType = xhr.getResponseHeader('Content-Type');

      if (xhr.status >= 500) {
        onError(new ServerError());

        return;
      }

      if (xhr.status === 404) {
        onError(new NotFoundError(xhr.status));

        return;
      }

      if (
        typeof contentType !== 'string' ||
        contentType.toLowerCase().match('application/json') === null
      ) {
        onError(new ContentTypeError(xhr.status));

        return;
      }

      if (xhr.status === 417) {
        try {
          var invalidParameterJson = JSON.parse(xhr.responseText);

          onError(
            new InvalidParameterError(
              xhr.status,
              invalidParameterJson.message,
              invalidParameterJson.description
            )
          );
        } catch (error) {
          onError(new JsonParseError(xhr.status));
        }

        return;
      }

      if (xhr.status === 422) {
        try {
          var expectationFailedJson = JSON.parse(xhr.responseText);

          onError(
            new ExpectationFailedError(
              xhr.status,
              expectationFailedJson.message,
              expectationFailedJson.description
            )
          );
        } catch (error) {
          onError(new JsonParseError(xhr.status));
        }

        return;
      }

      if (xhr.status === 429) {
        try {
          var throttledJson = JSON.parse(xhr.responseText);

          onError(
            new ThrottledError(
              xhr.status,
              throttledJson.message,
              throttledJson.description,
              xhr.getResponseHeader('Retry-After')
            )
          );
        } catch (error) {
          onError(new JsonParseError(xhr.status));
        }

        return;
      }

      if (xhr.status === 200) {
        try {
          var res = JSON.parse(xhr.responseText);
          res.query = query;
          onSuccess(res);
        } catch (error) {
          onError(new JsonParseError(xhr.status));
        }

        return;
      }

      try {
        var genericErrorJson = JSON.parse(xhr.responseText);
        onError(
          new GenericError(
            xhr.status,
            genericErrorJson.message,
            genericErrorJson.description
          )
        );
      } catch (error) {
        onError(new JsonParseError(xhr.status));
      }

      return;
    };

    xhr.open(
      'get',
      '/search/suggest.json?q=' + encodeURIComponent(query) + '&' + configParams
    );

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
  }

  function Cache(config) {
    this._store = {};
    this._keys = [];
    if (config && config.bucketSize) {
      this.bucketSize = config.bucketSize;
    } else {
      this.bucketSize = 20;
    }
  }

  Cache.prototype.set = function(key, value) {
    if (this.count() >= this.bucketSize) {
      var deleteKey = this._keys.splice(0, 1);
      this.delete(deleteKey);
    }

    this._keys.push(key);
    this._store[key] = value;

    return this._store;
  };

  Cache.prototype.get = function(key) {
    return this._store[key];
  };

  Cache.prototype.has = function(key) {
    return Boolean(this._store[key]);
  };

  Cache.prototype.count = function() {
    return Object.keys(this._store).length;
  };

  Cache.prototype.delete = function(key) {
    var exists = Boolean(this._store[key]);
    delete this._store[key];
    return exists && !this._store[key];
  };

  function Dispatcher() {
    this.events = {};
  }

  Dispatcher.prototype.on = function(eventName, callback) {
    var event = this.events[eventName];
    if (!event) {
      event = new DispatcherEvent(eventName);
      this.events[eventName] = event;
    }
    event.registerCallback(callback);
  };

  Dispatcher.prototype.off = function(eventName, callback) {
    var event = this.events[eventName];
    if (event && event.callbacks.indexOf(callback) > -1) {
      event.unregisterCallback(callback);
      if (event.callbacks.length === 0) {
        delete this.events[eventName];
      }
    }
  };

  Dispatcher.prototype.dispatch = function(eventName, payload) {
    var event = this.events[eventName];
    if (event) {
      event.fire(payload);
    }
  };

  function DispatcherEvent(eventName) {
    this.eventName = eventName;
    this.callbacks = [];
  }

  DispatcherEvent.prototype.registerCallback = function(callback) {
    this.callbacks.push(callback);
  };

  DispatcherEvent.prototype.unregisterCallback = function(callback) {
    var index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  };

  DispatcherEvent.prototype.fire = function(payload) {
    var callbacks = this.callbacks.slice(0);
    callbacks.forEach(function(callback) {
      callback(payload);
    });
  };

  function debounce(func, wait) {
    var timeout = null;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        func.apply(context, args);
      }, wait || 0);
    };
  }

  function objectToQueryParams(obj, parentKey) {
    var output = '';
    parentKey = parentKey || null;

    Object.keys(obj).forEach(function(key) {
      var outputKey = key + '=';
      if (parentKey) {
        outputKey = parentKey + '[' + key + ']';
      }

      switch (trueTypeOf(obj[key])) {
        case 'object':
          output += objectToQueryParams(obj[key], parentKey ? outputKey : key);
          break;
        case 'array':
          output += outputKey + '=' + obj[key].join(',') + '&';
          break;
        default:
          if (parentKey) {
            outputKey += '=';
          }
          output += outputKey + encodeURIComponent(obj[key]) + '&';
          break;
      }
    });

    return output;
  }

  function trueTypeOf(obj) {
    return Object.prototype.toString
      .call(obj)
      .slice(8, -1)
      .toLowerCase();
  }

  var DEBOUNCE_RATE = 10;
  var requestDebounced = debounce(request, DEBOUNCE_RATE);

  function PredictiveSearch(config) {
    if (!config) {
      throw new TypeError('No config object was specified');
    }

    this._retryAfter = null;
    this._currentQuery = null;

    this.dispatcher = new Dispatcher();
    this.cache = new Cache({ bucketSize: 40 });
    this.configParams = objectToQueryParams(config);
  }

  PredictiveSearch.TYPES = {
    PRODUCT: 'product',
    PAGE: 'page',
    ARTICLE: 'article'
  };

  PredictiveSearch.FIELDS = {
    AUTHOR: 'author',
    BODY: 'body',
    PRODUCT_TYPE: 'product_type',
    TAG: 'tag',
    TITLE: 'title',
    VARIANTS_BARCODE: 'variants.barcode',
    VARIANTS_SKU: 'variants.sku',
    VARIANTS_TITLE: 'variants.title',
    VENDOR: 'vendor'
  };

  PredictiveSearch.UNAVAILABLE_PRODUCTS = {
    SHOW: 'show',
    HIDE: 'hide',
    LAST: 'last'
  };

  PredictiveSearch.prototype.query = function query(query) {
    try {
      validateQuery(query);
    } catch (error) {
      this.dispatcher.dispatch('error', error);
      return;
    }

    if (query === '') {
      return this;
    }

    this._currentQuery = normalizeQuery(query);
    var cacheResult = this.cache.get(this._currentQuery);
    if (cacheResult) {
      this.dispatcher.dispatch('success', cacheResult);
      return this;
    }

    requestDebounced(
      this.configParams,
      query,
      function(result) {
        this.cache.set(normalizeQuery(result.query), result);
        if (normalizeQuery(result.query) === this._currentQuery) {
          this._retryAfter = null;
          this.dispatcher.dispatch('success', result);
        }
      }.bind(this),
      function(error) {
        if (error.retryAfter) {
          this._retryAfter = error.retryAfter;
        }
        this.dispatcher.dispatch('error', error);
      }.bind(this)
    );

    return this;
  };

  PredictiveSearch.prototype.on = function on(eventName, callback) {
    this.dispatcher.on(eventName, callback);

    return this;
  };

  PredictiveSearch.prototype.off = function on(eventName, callback) {
    this.dispatcher.off(eventName, callback);

    return this;
  };

  function normalizeQuery(query) {
    if (typeof query !== 'string') {
      return null;
    }

    return query
      .trim()
      .replace(' ', '-')
      .toLowerCase();
  }

  return PredictiveSearch;
})();

this.Shopify = this.Shopify || {};
this.Shopify.theme = this.Shopify.theme || {};
this.Shopify.theme.PredictiveSearchComponent = (function(PredictiveSearch) {
  'use strict';

  PredictiveSearch =
    PredictiveSearch && PredictiveSearch.hasOwnProperty('default')
      ? PredictiveSearch['default']
      : PredictiveSearch;

  var DEFAULT_PREDICTIVE_SEARCH_API_CONFIG = {
    resources: {
      type: [PredictiveSearch.TYPES.PRODUCT],
      options: {
        unavailable_products: PredictiveSearch.UNAVAILABLE_PRODUCTS.LAST,
        fields: [
          PredictiveSearch.FIELDS.TITLE,
          PredictiveSearch.FIELDS.VENDOR,
          PredictiveSearch.FIELDS.PRODUCT_TYPE,
          PredictiveSearch.FIELDS.VARIANTS_TITLE
        ]
      }
    }
  };

  function PredictiveSearchComponent(config) {
    // validate config
    if (
      !config ||
      !config.selectors ||
      !config.selectors.input ||
      !isString(config.selectors.input) ||
      !config.selectors.result ||
      !isString(config.selectors.result) ||
      !config.resultTemplateFct ||
      !isFunction(config.resultTemplateFct) ||
      !config.numberOfResultsTemplateFct ||
      !isFunction(config.numberOfResultsTemplateFct) ||
      !config.loadingResultsMessageTemplateFct ||
      !isFunction(config.loadingResultsMessageTemplateFct)
    ) {
      var error = new TypeError(
        'PredictiveSearchComponent config is not valid'
      );
      error.type = 'argument';
      throw error;
    }

    // Find nodes
    this.nodes = findNodes(config.selectors);

    // Validate nodes
    if (!isValidNodes(this.nodes)) {
      // eslint-disable-next-line no-console
      console.warn('Could not find valid nodes');
      return;
    }

    // Store the keyword that was used for the search
    this._searchKeyword = '';

    // Assign result template
    this.resultTemplateFct = config.resultTemplateFct;

    // Assign number of results template
    this.numberOfResultsTemplateFct = config.numberOfResultsTemplateFct;

    // Assign loading state template function
    this.loadingResultsMessageTemplateFct =
      config.loadingResultsMessageTemplateFct;

    // Assign number of search results
    this.numberOfResults = config.numberOfResults || 4;

    // Set classes
    this.classes = {
      visibleVariant: config.visibleVariant
        ? config.visibleVariant
        : 'predictive-search-wrapper--visible',
      itemSelected: config.itemSelectedClass
        ? config.itemSelectedClass
        : 'predictive-search-item--selected',
      clearButtonVisible: config.clearButtonVisibleClass
        ? config.clearButtonVisibleClass
        : 'predictive-search__clear-button--visible'
    };

    this.selectors = {
      searchResult: config.searchResult
        ? config.searchResult
        : '[data-search-result]'
    };

    // Assign callbacks
    this.callbacks = assignCallbacks(config);

    // Add input attributes
    addInputAttributes(this.nodes.input);

    // Add input event listeners
    this._addInputEventListeners();

    // Add body listener
    this._addBodyEventListener();

    // Add accessibility announcer
    this._addAccessibilityAnnouncer();

    // Display the reset button if the input is not empty
    this._toggleClearButtonVisibility();

    // Instantiate Predictive Search API
    this.predictiveSearch = new PredictiveSearch(
      config.PredictiveSearchAPIConfig
        ? config.PredictiveSearchAPIConfig
        : DEFAULT_PREDICTIVE_SEARCH_API_CONFIG
    );

    // Add predictive search success event listener
    this.predictiveSearch.on(
      'success',
      this._handlePredictiveSearchSuccess.bind(this)
    );

    // Add predictive search error event listener
    this.predictiveSearch.on(
      'error',
      this._handlePredictiveSearchError.bind(this)
    );
  }

  /**
   * Private methods
   */
  function findNodes(selectors) {
    return {
      input: document.querySelector(selectors.input),
      reset: document.querySelector(selectors.reset),
      result: document.querySelector(selectors.result)
    };
  }

  function isValidNodes(nodes) {
    if (
      !nodes ||
      !nodes.input ||
      !nodes.result ||
      nodes.input.tagName !== 'INPUT'
    ) {
      return false;
    }

    return true;
  }

  function assignCallbacks(config) {
    return {
      onBodyMousedown: config.onBodyMousedown,
      onBeforeOpen: config.onBeforeOpen,
      onOpen: config.onOpen,
      onBeforeClose: config.onBeforeClose,
      onClose: config.onClose,
      onInputFocus: config.onInputFocus,
      onInputKeyup: config.onInputKeyup,
      onInputBlur: config.onInputBlur,
      onInputReset: config.onInputReset,
      onBeforeDestroy: config.onBeforeDestroy,
      onDestroy: config.onDestroy
    };
  }

  function addInputAttributes(input) {
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
  }

  function removeInputAttributes(input) {
    input.removeAttribute('autocorrect', 'off');
    input.removeAttribute('autocomplete', 'off');
    input.removeAttribute('autocapitalize', 'off');
    input.removeAttribute('spellcheck', 'false');
  }

  /**
   * Public variables
   */
  PredictiveSearchComponent.prototype.isResultVisible = false;
  PredictiveSearchComponent.prototype.results = {};

  /**
   * "Private" variables
   */
  PredictiveSearchComponent.prototype._latencyTimer = null;
  PredictiveSearchComponent.prototype._resultNodeClicked = false;

  /**
   * "Private" instance methods
   */
  PredictiveSearchComponent.prototype._addInputEventListeners = function() {
    var input = this.nodes.input;
    var reset = this.nodes.reset;

    if (!input) {
      return;
    }

    this._handleInputFocus = this._handleInputFocus.bind(this);
    this._handleInputBlur = this._handleInputBlur.bind(this);
    this._handleInputKeyup = this._handleInputKeyup.bind(this);
    this._handleInputKeydown = this._handleInputKeydown.bind(this);

    input.addEventListener('focus', this._handleInputFocus);
    input.addEventListener('blur', this._handleInputBlur);
    input.addEventListener('keyup', this._handleInputKeyup);
    input.addEventListener('keydown', this._handleInputKeydown);

    if (reset) {
      this._handleInputReset = this._handleInputReset.bind(this);
      reset.addEventListener('click', this._handleInputReset);
    }
  };

  PredictiveSearchComponent.prototype._removeInputEventListeners = function() {
    var input = this.nodes.input;

    input.removeEventListener('focus', this._handleInputFocus);
    input.removeEventListener('blur', this._handleInputBlur);
    input.removeEventListener('keyup', this._handleInputKeyup);
    input.removeEventListener('keydown', this._handleInputKeydown);
  };

  PredictiveSearchComponent.prototype._addBodyEventListener = function() {
    this._handleBodyMousedown = this._handleBodyMousedown.bind(this);

    document
      .querySelector('body')
      .addEventListener('mousedown', this._handleBodyMousedown);
  };

  PredictiveSearchComponent.prototype._removeBodyEventListener = function() {
    document
      .querySelector('body')
      .removeEventListener('mousedown', this._handleBodyMousedown);
  };

  PredictiveSearchComponent.prototype._removeClearButtonEventListener = function() {
    var reset = this.nodes.reset;

    if (!reset) {
      return;
    }

    reset.removeEventListener('click', this._handleInputReset);
  };

  /**
   * Event handlers
   */
  PredictiveSearchComponent.prototype._handleBodyMousedown = function(evt) {
    if (this.isResultVisible && this.nodes !== null) {
      if (
        evt.target.isEqualNode(this.nodes.input) ||
        this.nodes.input.contains(evt.target) ||
        evt.target.isEqualNode(this.nodes.result) ||
        this.nodes.result.contains(evt.target)
      ) {
        this._resultNodeClicked = true;
      } else {
        if (isFunction(this.callbacks.onBodyMousedown)) {
          var returnedValue = this.callbacks.onBodyMousedown(this.nodes);
          if (isBoolean(returnedValue) && returnedValue) {
            this.close();
          }
        } else {
          this.close();
        }
      }
    }
  };

  PredictiveSearchComponent.prototype._handleInputFocus = function(evt) {
    if (isFunction(this.callbacks.onInputFocus)) {
      var returnedValue = this.callbacks.onInputFocus(this.nodes);
      if (isBoolean(returnedValue) && !returnedValue) {
        return false;
      }
    }

    if (evt.target.value.length > 0) {
      this._search();
    }

    return true;
  };

  PredictiveSearchComponent.prototype._handleInputBlur = function() {
    // This has to be done async, to wait for the focus to be on the next
    // element and avoid closing the results.
    // Example: Going from the input to the reset button.
    setTimeout(
      function() {
        if (isFunction(this.callbacks.onInputBlur)) {
          var returnedValue = this.callbacks.onInputBlur(this.nodes);
          if (isBoolean(returnedValue) && !returnedValue) {
            return false;
          }
        }

        if (document.activeElement.isEqualNode(this.nodes.reset)) {
          return false;
        }

        if (this._resultNodeClicked) {
          this._resultNodeClicked = false;
          return false;
        }

        this.close();
      }.bind(this)
    );

    return true;
  };

  PredictiveSearchComponent.prototype._addAccessibilityAnnouncer = function() {
    this._accessibilityAnnouncerDiv = window.document.createElement('div');

    this._accessibilityAnnouncerDiv.setAttribute(
      'style',
      'position: absolute !important; overflow: hidden; clip: rect(0 0 0 0); height: 1px; width: 1px; margin: -1px; padding: 0; border: 0;'
    );

    this._accessibilityAnnouncerDiv.setAttribute('data-search-announcer', '');
    this._accessibilityAnnouncerDiv.setAttribute('aria-live', 'polite');
    this._accessibilityAnnouncerDiv.setAttribute('aria-atomic', 'true');

    this.nodes.result.parentElement.appendChild(
      this._accessibilityAnnouncerDiv
    );
  };

  PredictiveSearchComponent.prototype._removeAccessibilityAnnouncer = function() {
    this.nodes.result.parentElement.removeChild(
      this._accessibilityAnnouncerDiv
    );
  };

  PredictiveSearchComponent.prototype._updateAccessibilityAttributesAfterSelectingElement = function(
    previousSelectedElement,
    currentSelectedElement
  ) {
    // Update the active descendant on the search input
    this.nodes.input.setAttribute(
      'aria-activedescendant',
      currentSelectedElement.id
    );

    // Unmark the previousSelected elemented as selected
    if (previousSelectedElement) {
      previousSelectedElement.removeAttribute('aria-selected');
    }

    // Mark the element as selected
    currentSelectedElement.setAttribute('aria-selected', true);
  };

  PredictiveSearchComponent.prototype._clearAriaActiveDescendant = function() {
    this.nodes.input.setAttribute('aria-activedescendant', '');
  };

  PredictiveSearchComponent.prototype._announceNumberOfResultsFound = function(
    results
  ) {
    var currentAnnouncedMessage = this._accessibilityAnnouncerDiv.innerHTML;
    var newMessage = this.numberOfResultsTemplateFct(results);

    // If the messages are the same, they won't get announced
    // add white space so it gets announced
    if (currentAnnouncedMessage === newMessage) {
      newMessage = newMessage + '&nbsp;';
    }

    this._accessibilityAnnouncerDiv.innerHTML = newMessage;
  };

  PredictiveSearchComponent.prototype._announceLoadingState = function() {
    this._accessibilityAnnouncerDiv.innerHTML = this.loadingResultsMessageTemplateFct();
  };

  PredictiveSearchComponent.prototype._handleInputKeyup = function(evt) {
    var UP_ARROW_KEY_CODE = 38;
    var DOWN_ARROW_KEY_CODE = 40;
    var RETURN_KEY_CODE = 13;
    var ESCAPE_KEY_CODE = 27;

    if (isFunction(this.callbacks.onInputKeyup)) {
      var returnedValue = this.callbacks.onInputKeyup(this.nodes);
      if (isBoolean(returnedValue) && !returnedValue) {
        return false;
      }
    }

    this._toggleClearButtonVisibility();

    if (this.isResultVisible && this.nodes !== null) {
      if (evt.keyCode === UP_ARROW_KEY_CODE) {
        this._navigateOption(evt, 'UP');
        return true;
      }

      if (evt.keyCode === DOWN_ARROW_KEY_CODE) {
        this._navigateOption(evt, 'DOWN');
        return true;
      }

      if (evt.keyCode === RETURN_KEY_CODE) {
        this._selectOption();
        return true;
      }

      if (evt.keyCode === ESCAPE_KEY_CODE) {
        this.close();
      }
    }

    if (evt.target.value.length <= 0) {
      this.close();
      this._setKeyword('');
    } else if (evt.target.value.length > 0) {
      this._search();
    }

    return true;
  };

  PredictiveSearchComponent.prototype._handleInputKeydown = function(evt) {
    var RETURN_KEY_CODE = 13;
    var UP_ARROW_KEY_CODE = 38;
    var DOWN_ARROW_KEY_CODE = 40;

    // Prevent the form default submission if there is a selected option
    if (evt.keyCode === RETURN_KEY_CODE && this._getSelectedOption() !== null) {
      evt.preventDefault();
    }

    // Prevent the cursor from moving in the input when using the up and down arrow keys
    if (
      evt.keyCode === UP_ARROW_KEY_CODE ||
      evt.keyCode === DOWN_ARROW_KEY_CODE
    ) {
      evt.preventDefault();
    }
  };

  PredictiveSearchComponent.prototype._handleInputReset = function(evt) {
    evt.preventDefault();

    if (isFunction(this.callbacks.onInputReset)) {
      var returnedValue = this.callbacks.onInputReset(this.nodes);
      if (isBoolean(returnedValue) && !returnedValue) {
        return false;
      }
    }

    this.nodes.input.value = '';
    this.nodes.input.focus();
    this._toggleClearButtonVisibility();
    this.close();

    return true;
  };

  PredictiveSearchComponent.prototype._navigateOption = function(
    evt,
    direction
  ) {
    var currentOption = this._getSelectedOption();

    if (!currentOption) {
      var firstOption = this.nodes.result.querySelector(
        this.selectors.searchResult
      );
      firstOption.classList.add(this.classes.itemSelected);
      this._updateAccessibilityAttributesAfterSelectingElement(
        null,
        firstOption
      );
    } else {
      if (direction === 'DOWN') {
        var nextOption = currentOption.nextElementSibling;
        if (nextOption) {
          currentOption.classList.remove(this.classes.itemSelected);
          nextOption.classList.add(this.classes.itemSelected);
          this._updateAccessibilityAttributesAfterSelectingElement(
            currentOption,
            nextOption
          );
        }
      } else {
        var previousOption = currentOption.previousElementSibling;
        if (previousOption) {
          currentOption.classList.remove(this.classes.itemSelected);
          previousOption.classList.add(this.classes.itemSelected);
          this._updateAccessibilityAttributesAfterSelectingElement(
            currentOption,
            previousOption
          );
        }
      }
    }
  };

  PredictiveSearchComponent.prototype._getSelectedOption = function() {
    return this.nodes.result.querySelector('.' + this.classes.itemSelected);
  };

  PredictiveSearchComponent.prototype._selectOption = function() {
    var selectedOption = this._getSelectedOption();

    if (selectedOption) {
      selectedOption.querySelector('a, button').click();
    }
  };

  PredictiveSearchComponent.prototype._search = function() {
    var newSearchKeyword = this.nodes.input.value;

    if (this._searchKeyword === newSearchKeyword) {
      return;
    }

    clearTimeout(this._latencyTimer);
    this._latencyTimer = setTimeout(
      function() {
        this.results.isLoading = true;

        // Annonuce that we're loading the results
        this._announceLoadingState();

        this.nodes.result.classList.add(this.classes.visibleVariant);
        // NOTE: We could benifit in using DOMPurify.
        // https://github.com/cure53/DOMPurify
        this.nodes.result.innerHTML = this.resultTemplateFct(this.results);
      }.bind(this),
      500
    );

    this.predictiveSearch.query(newSearchKeyword);
    this._setKeyword(newSearchKeyword);
  };

  PredictiveSearchComponent.prototype._handlePredictiveSearchSuccess = function(
    json
  ) {
    clearTimeout(this._latencyTimer);
    this.results = json.resources.results;

    this.results.isLoading = false;
    this.results.products = this.results.products.slice(
      0,
      this.numberOfResults
    );
    this.results.canLoadMore =
      this.numberOfResults <= this.results.products.length;
    this.results.searchQuery = this.nodes.input.value;

    if (this.results.products.length > 0 || this.results.searchQuery) {
      this.nodes.result.innerHTML = this.resultTemplateFct(this.results);
      this._announceNumberOfResultsFound(this.results);
      this.open();
    } else {
      this.nodes.result.innerHTML = '';

      this._closeOnNoResults();
    }
  };

  PredictiveSearchComponent.prototype._handlePredictiveSearchError = function() {
    clearTimeout(this._latencyTimer);
    this.nodes.result.innerHTML = '';

    this._closeOnNoResults();
  };

  PredictiveSearchComponent.prototype._closeOnNoResults = function() {
    if (this.nodes) {
      this.nodes.result.classList.remove(this.classes.visibleVariant);
    }

    this.isResultVisible = false;
  };

  PredictiveSearchComponent.prototype._setKeyword = function(keyword) {
    this._searchKeyword = keyword;
  };

  PredictiveSearchComponent.prototype._toggleClearButtonVisibility = function() {
    if (!this.nodes.reset) {
      return;
    }

    if (this.nodes.input.value.length > 0) {
      this.nodes.reset.classList.add(this.classes.clearButtonVisible);
    } else {
      this.nodes.reset.classList.remove(this.classes.clearButtonVisible);
    }
  };

  /**
   * Public methods
   */
  PredictiveSearchComponent.prototype.open = function() {
    if (this.isResultVisible) {
      return;
    }

    if (isFunction(this.callbacks.onBeforeOpen)) {
      var returnedValue = this.callbacks.onBeforeOpen(this.nodes);
      if (isBoolean(returnedValue) && !returnedValue) {
        return false;
      }
    }

    this.nodes.result.classList.add(this.classes.visibleVariant);
    this.nodes.input.setAttribute('aria-expanded', true);
    this.isResultVisible = true;

    if (isFunction(this.callbacks.onOpen)) {
      return this.callbacks.onOpen(this.nodes) || true;
    }

    return true;
  };

  PredictiveSearchComponent.prototype.close = function() {
    if (!this.isResultVisible) {
      return true;
    }

    if (isFunction(this.callbacks.onBeforeClose)) {
      var returnedValue = this.callbacks.onBeforeClose(this.nodes);
      if (isBoolean(returnedValue) && !returnedValue) {
        return false;
      }
    }

    if (this.nodes) {
      this.nodes.result.classList.remove(this.classes.visibleVariant);
    }

    this.nodes.input.setAttribute('aria-expanded', false);
    this._clearAriaActiveDescendant();
    this._setKeyword('');

    if (isFunction(this.callbacks.onClose)) {
      this.callbacks.onClose(this.nodes);
    }

    this.isResultVisible = false;
    this.results = {};

    return true;
  };

  PredictiveSearchComponent.prototype.destroy = function() {
    this.close();

    if (isFunction(this.callbacks.onBeforeDestroy)) {
      var returnedValue = this.callbacks.onBeforeDestroy(this.nodes);
      if (isBoolean(returnedValue) && !returnedValue) {
        return false;
      }
    }

    this.nodes.result.classList.remove(this.classes.visibleVariant);
    removeInputAttributes(this.nodes.input);
    this._removeInputEventListeners();
    this._removeBodyEventListener();
    this._removeAccessibilityAnnouncer();
    this._removeClearButtonEventListener();

    if (isFunction(this.callbacks.onDestroy)) {
      this.callbacks.onDestroy(this.nodes);
    }

    return true;
  };

  PredictiveSearchComponent.prototype.clearAndClose = function() {
    this.nodes.input.value = '';
    this.close();
  };

  /**
   * Utilities
   */
  function getTypeOf(value) {
    return Object.prototype.toString.call(value);
  }

  function isString(value) {
    return getTypeOf(value) === '[object String]';
  }

  function isBoolean(value) {
    return getTypeOf(value) === '[object Boolean]';
  }

  function isFunction(value) {
    return getTypeOf(value) === '[object Function]';
  }

  return PredictiveSearchComponent;
})(Shopify.theme.PredictiveSearch);


/* ================ GLOBAL ================ */
/*============================================================================
  Drawer modules
==============================================================================*/
theme.Drawers = (function() {
  function Drawer(id, position, options) {
    var DEFAULT_OPEN_CLASS = 'js-drawer-open';
    var DEFAULT_CLOSE_CLASS = 'js-drawer-close';

    var defaults = {
      selectors: {
        openVariant: '.' + DEFAULT_OPEN_CLASS + '-' + position,
        close: '.' + DEFAULT_CLOSE_CLASS
      },
      classes: {
        open: DEFAULT_OPEN_CLASS,
        openVariant: DEFAULT_OPEN_CLASS + '-' + position
      },
      withPredictiveSearch: false
    };

    this.nodes = {
      $parent: $('html').add('body'),
      $page: $('#PageContainer')
    };

    this.config = $.extend(defaults, options);
    this.position = position;
    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  }

  Drawer.prototype.init = function() {
    $(this.config.selectors.openVariant).on('click', $.proxy(this.open, this));
    this.$drawer.on(
      'click',
      this.config.selectors.close,
      $.proxy(this.close, this)
    );
  };

  Drawer.prototype.open = function(evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to nodes.$page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    if (!this.config.withPredictiveSearch) {
      this.$drawer.prepareTransition();
    }

    this.nodes.$parent.addClass(
      this.config.classes.open + ' ' + this.config.classes.openVariant
    );
    this.drawerIsOpen = true;

    // Run function when draw opens if set
    if (
      this.config.onDrawerOpen &&
      typeof this.config.onDrawerOpen === 'function'
    ) {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    // Set focus on drawer
    var trapFocusConfig = {
      $container: this.$drawer,
      namespace: 'drawer_focus'
    };
    if (this.config.$elementToFocusOnOpen) {
      trapFocusConfig.$elementToFocus = this.config.$elementToFocusOnOpen;
    }

    slate.a11y.trapFocus(trapFocusConfig);

    this.bindEvents();

    return this;
  };

  Drawer.prototype.close = function() {
    if (!this.drawerIsOpen) {
      // don't close a closed drawer
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    if (!this.config.withPredictiveSearch) {
      this.$drawer.prepareTransition();
    }

    this.nodes.$parent.removeClass(
      this.config.classes.open + ' ' + this.config.classes.openVariant
    );

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'false');
    }

    this.drawerIsOpen = false;

    // Remove focus on drawer
    slate.a11y.removeTrapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    this.unbindEvents();

    // Run function when draw closes if set
    if (
      this.config.onDrawerClose &&
      typeof this.config.onDrawerClose === 'function'
    ) {
      this.config.onDrawerClose();
    }
  };

  Drawer.prototype.bindEvents = function() {
    this.nodes.$parent.on(
      'keyup.drawer',
      $.proxy(function(evt) {
        // close on 'esc' keypress
        if (evt.keyCode === 27) {
          this.close();
          return false;
        } else {
          return true;
        }
      }, this)
    );

    // Lock scrolling on mobile
    this.nodes.$page.on('touchmove.drawer', function() {
      return false;
    });

    this.nodes.$page.on(
      'click.drawer',
      $.proxy(function() {
        this.close();
        return false;
      }, this)
    );
  };

  Drawer.prototype.unbindEvents = function() {
    this.nodes.$page.off('.drawer');
    this.nodes.$parent.off('.drawer');
  };

  return Drawer;
})();

theme.Helpers = (function() {
  var touchDevice = false;

  function setTouch() {
    touchDevice = true;
  }

  function isTouch() {
    return touchDevice;
  }
  return {
    setTouch: setTouch,
    isTouch: isTouch
  };
})();

theme.LibraryLoader = (function() {
  var types = {
    link: 'link',
    script: 'script'
  };

  var status = {
    requested: 'requested',
    loaded: 'loaded'
  };

  var cloudCdn = 'https://cdn.shopify.com/shopifycloud/';

  var libraries = {
    youtubeSdk: {
      tagId: 'youtube-sdk',
      src: 'https://www.youtube.com/iframe_api',
      type: types.script
    },
    plyrShopifyStyles: {
      tagId: 'plyr-shopify-styles',
      src: cloudCdn + 'shopify-plyr/v1.0/shopify-plyr.css',
      type: types.link
    },
    modelViewerUiStyles: {
      tagId: 'shopify-model-viewer-ui-styles',
      src: cloudCdn + 'model-viewer-ui/assets/v1.0/model-viewer-ui.css',
      type: types.link
    }
  };

  function load(libraryName, callback) {
    var library = libraries[libraryName];

    if (!library) return;
    if (library.status === status.requested) return;

    callback = callback || function() {};
    if (library.status === status.loaded) {
      callback();
      return;
    }

    library.status = status.requested;

    var tag;

    switch (library.type) {
      case types.script:
        tag = createScriptTag(library, callback);
        break;
      case types.link:
        tag = createLinkTag(library, callback);
        break;
    }

    tag.id = library.tagId;
    library.element = tag;

    var firstScriptTag = document.getElementsByTagName(library.type)[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function createScriptTag(library, callback) {
    var tag = document.createElement('script');
    tag.src = library.src;
    tag.addEventListener('load', function() {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }

  function createLinkTag(library, callback) {
    var tag = document.createElement('link');
    tag.href = library.src;
    tag.rel = 'stylesheet';
    tag.type = 'text/css';
    tag.addEventListener('load', function() {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }

  return {
    load: load
  };
})();


/* ================ MODULES ================ */
window.theme = window.theme || {};

theme.Header = (function() {
  var selectors = {
    body: 'body',
    navigation: '#AccessibleNav',
    siteNavHasDropdown: '[data-has-dropdowns]',
    siteNavChildLinks: '.site-nav__child-link',
    siteNavActiveDropdown: '.site-nav--active-dropdown',
    siteNavHasCenteredDropdown: '.site-nav--has-centered-dropdown',
    siteNavCenteredDropdown: '.site-nav__dropdown--centered',
    siteNavLinkMain: '.site-nav__link--main',
    siteNavChildLink: '.site-nav__link--last',
    siteNavDropdown: '.site-nav__dropdown',
    siteHeader: '.site-header'
  };

  var config = {
    activeClass: 'site-nav--active-dropdown',
    childLinkClass: 'site-nav__child-link',
    rightDropdownClass: 'site-nav__dropdown--right',
    leftDropdownClass: 'site-nav__dropdown--left'
  };

  var cache = {};

  function init() {
    cacheSelectors();
    styleDropdowns($(selectors.siteNavHasDropdown));
    positionFullWidthDropdowns();

    cache.$parents.on('click.siteNav', function() {
      var $el = $(this);
      $el.hasClass(config.activeClass) ? hideDropdown($el) : showDropdown($el);
    });

    // check when we're leaving a dropdown and close the active dropdown
    $(selectors.siteNavChildLink).on('focusout.siteNav', function() {
      setTimeout(function() {
        if (
          $(document.activeElement).hasClass(config.childLinkClass) ||
          !cache.$activeDropdown.length
        ) {
          return;
        }

        hideDropdown(cache.$activeDropdown);
      });
    });

    // close dropdowns when on top level nav
    cache.$topLevel.on('focus.siteNav', function() {
      if (cache.$activeDropdown.length) {
        hideDropdown(cache.$activeDropdown);
      }
    });

    cache.$subMenuLinks.on('click.siteNav', function(evt) {
      // Prevent click on body from firing instead of link
      evt.stopImmediatePropagation();
    });

    $(window).resize(
      $.debounce(50, function() {
        styleDropdowns($(selectors.siteNavHasDropdown));
        positionFullWidthDropdowns();
      })
    );
  }

  function cacheSelectors() {
    cache = {
      $nav: $(selectors.navigation),
      $topLevel: $(selectors.siteNavLinkMain),
      $parents: $(selectors.navigation).find(selectors.siteNavHasDropdown),
      $subMenuLinks: $(selectors.siteNavChildLinks),
      $activeDropdown: $(selectors.siteNavActiveDropdown),
      $siteHeader: $(selectors.siteHeader)
    };
  }

  function showDropdown($el) {
    $el.addClass(config.activeClass);

    // close open dropdowns
    if (cache.$activeDropdown.length) {
      hideDropdown(cache.$activeDropdown);
    }

    cache.$activeDropdown = $el;

    // set expanded on open dropdown
    $el.find(selectors.siteNavLinkMain).attr('aria-expanded', 'true');

    setTimeout(function() {
      $(window).on('keyup.siteNav', function(evt) {
        if (evt.keyCode === 27) {
          hideDropdown($el);
        }
      });

      $(selectors.body).on('click.siteNav', function() {
        hideDropdown($el);
      });
    }, 250);
  }

  function hideDropdown($el) {
    // remove aria on open dropdown
    $el.find(selectors.siteNavLinkMain).attr('aria-expanded', 'false');
    $el.removeClass(config.activeClass);

    // reset active dropdown
    cache.$activeDropdown = $(selectors.siteNavActiveDropdown);

    $(selectors.body).off('click.siteNav');
    $(window).off('keyup.siteNav');
  }

  function styleDropdowns($dropdownListItems) {
    $dropdownListItems.each(function() {
      var $dropdownLi = $(this).find(selectors.siteNavDropdown);
      if (!$dropdownLi.length) {
        return;
      }
      var isRightOfLogo =
        Math.ceil($(this).offset().left) >
        Math.floor(cache.$siteHeader.outerWidth()) / 2
          ? true
          : false;
      if (isRightOfLogo) {
        $dropdownLi
          .removeClass(config.leftDropdownClass)
          .addClass(config.rightDropdownClass);
      } else {
        $dropdownLi
          .removeClass(config.rightDropdownClass)
          .addClass(config.leftDropdownClass);
      }
    });
  }

  function positionFullWidthDropdowns() {
    var $listWithCenteredDropdown = $(selectors.siteNavHasCenteredDropdown);

    $listWithCenteredDropdown.each(function() {
      var $hasCenteredDropdown = $(this);
      var $fullWidthDropdown = $hasCenteredDropdown.find(
        selectors.siteNavCenteredDropdown
      );

      var fullWidthDropdownOffset = $hasCenteredDropdown.position().top + 41;
      $fullWidthDropdown.css('top', fullWidthDropdownOffset);
    });
  }

  function unload() {
    $(window).off('.siteNav');
    cache.$parents.off('.siteNav');
    cache.$subMenuLinks.off('.siteNav');
    cache.$topLevel.off('.siteNav');
    $(selectors.siteNavChildLink).off('.siteNav');
    $(selectors.body).off('.siteNav');
  }

  return {
    init: init,
    unload: unload
  };
})();

window.theme = window.theme || {};

theme.MobileNav = (function() {
  var classes = {
    mobileNavOpenIcon: 'mobile-nav--open',
    mobileNavCloseIcon: 'mobile-nav--close',
    navLinkWrapper: 'mobile-nav__item',
    navLink: 'mobile-nav__link',
    subNavLink: 'mobile-nav__sublist-link',
    return: 'mobile-nav__return-btn',
    subNavActive: 'is-active',
    subNavClosing: 'is-closing',
    navOpen: 'js-menu--is-open',
    subNavShowing: 'sub-nav--is-open',
    thirdNavShowing: 'third-nav--is-open',
    subNavToggleBtn: 'js-toggle-submenu'
  };
  var cache = {};
  var isTransitioning;
  var $activeSubNav;
  var $activeTrigger;
  var menuLevel = 1;
  // Breakpoints from src/stylesheets/global/variables.scss.liquid
  var mediaQuerySmall = 'screen and (max-width: 749px)';

  function init() {
    cacheSelectors();

    cache.$mobileNavToggle.on('click', toggleMobileNav);
    cache.$subNavToggleBtn.on('click.subNav', toggleSubNav);

    // Close mobile nav when unmatching mobile breakpoint
    enquire.register(mediaQuerySmall, {
      unmatch: function() {
        if (cache.$mobileNavContainer.hasClass(classes.navOpen)) {
          closeMobileNav();
        }
      }
    });
  }

  function toggleMobileNav() {
    if (cache.$mobileNavToggle.hasClass(classes.mobileNavCloseIcon)) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function cacheSelectors() {
    cache = {
      $pageContainer: $('#PageContainer'),
      $siteHeader: $('.site-header'),
      $mobileNavToggle: $('.js-mobile-nav-toggle'),
      $mobileNavContainer: $('.mobile-nav-wrapper'),
      $mobileNav: $('#MobileNav'),
      $sectionHeader: $('#shopify-section-header'),
      $subNavToggleBtn: $('.' + classes.subNavToggleBtn)
    };
  }

  function openMobileNav() {
    var translateHeaderHeight = cache.$siteHeader.outerHeight();

    cache.$mobileNavContainer.prepareTransition().addClass(classes.navOpen);

    cache.$mobileNavContainer.css({
      transform: 'translateY(' + translateHeaderHeight + 'px)'
    });

    cache.$pageContainer.css({
      transform:
        'translate3d(0, ' + cache.$mobileNavContainer[0].scrollHeight + 'px, 0)'
    });

    slate.a11y.trapFocus({
      $container: cache.$sectionHeader,
      $elementToFocus: cache.$mobileNavToggle,
      namespace: 'navFocus'
    });

    cache.$mobileNavToggle
      .addClass(classes.mobileNavCloseIcon)
      .removeClass(classes.mobileNavOpenIcon)
      .attr('aria-expanded', true);

    // close on escape
    $(window).on('keyup.mobileNav', function(evt) {
      if (evt.which === 27) {
        closeMobileNav();
      }
    });
  }

  function closeMobileNav() {
    cache.$mobileNavContainer.prepareTransition().removeClass(classes.navOpen);

    cache.$mobileNavContainer.css({
      transform: 'translateY(-100%)'
    });

    cache.$pageContainer.removeAttr('style');

    slate.a11y.trapFocus({
      $container: $('html'),
      $elementToFocus: $('body')
    });

    cache.$mobileNavContainer.one(
      'TransitionEnd.navToggle webkitTransitionEnd.navToggle transitionend.navToggle oTransitionEnd.navToggle',
      function() {
        slate.a11y.removeTrapFocus({
          $container: cache.$mobileNav,
          namespace: 'navFocus'
        });
      }
    );

    cache.$mobileNavToggle
      .addClass(classes.mobileNavOpenIcon)
      .removeClass(classes.mobileNavCloseIcon)
      .attr('aria-expanded', false)
      .focus();

    $(window).off('keyup.mobileNav');

    scrollTo(0, 0);
  }

  function toggleSubNav(evt) {
    if (isTransitioning) {
      return;
    }

    var $toggleBtn = $(evt.currentTarget);
    var isReturn = $toggleBtn.hasClass(classes.return);
    isTransitioning = true;

    if (isReturn) {
      // Close all subnavs by removing active class on buttons
      $(
        '.' + classes.subNavToggleBtn + '[data-level="' + (menuLevel - 1) + '"]'
      ).removeClass(classes.subNavActive);

      if ($activeTrigger && $activeTrigger.length) {
        $activeTrigger.removeClass(classes.subNavActive);
      }
    } else {
      $toggleBtn.addClass(classes.subNavActive);
    }

    $activeTrigger = $toggleBtn;

    goToSubnav($toggleBtn.data('target'));
  }

  function goToSubnav(target) {
    /*eslint-disable shopify/jquery-dollar-sign-reference */

    var $targetMenu = target
      ? $('.mobile-nav__dropdown[data-parent="' + target + '"]')
      : cache.$mobileNav;

    menuLevel = $targetMenu.data('level') ? $targetMenu.data('level') : 1;

    if ($activeSubNav && $activeSubNav.length) {
      $activeSubNav.prepareTransition().addClass(classes.subNavClosing);
    }

    $activeSubNav = $targetMenu;

    /*eslint-enable shopify/jquery-dollar-sign-reference */

    var translateMenuHeight = $targetMenu.outerHeight();

    var openNavClass =
      menuLevel > 2 ? classes.thirdNavShowing : classes.subNavShowing;

    cache.$mobileNavContainer
      .css('height', translateMenuHeight)
      .removeClass(classes.thirdNavShowing)
      .addClass(openNavClass);

    if (!target) {
      // Show top level nav
      cache.$mobileNavContainer
        .removeClass(classes.thirdNavShowing)
        .removeClass(classes.subNavShowing);
    }

    /* if going back to first subnav, focus is on whole header */
    var $container = menuLevel === 1 ? cache.$sectionHeader : $targetMenu;

    var $menuTitle = $targetMenu.find('[data-menu-title=' + menuLevel + ']');
    var $elementToFocus = $menuTitle ? $menuTitle : $targetMenu;

    // Focusing an item in the subnav early forces element into view and breaks the animation.
    cache.$mobileNavContainer.one(
      'TransitionEnd.subnavToggle webkitTransitionEnd.subnavToggle transitionend.subnavToggle oTransitionEnd.subnavToggle',
      function() {
        slate.a11y.trapFocus({
          $container: $container,
          $elementToFocus: $elementToFocus,
          namespace: 'subNavFocus'
        });

        cache.$mobileNavContainer.off('.subnavToggle');
        isTransitioning = false;
      }
    );

    // Match height of subnav
    cache.$pageContainer.css({
      transform: 'translateY(' + translateMenuHeight + 'px)'
    });

    $activeSubNav.removeClass(classes.subNavClosing);
  }

  return {
    init: init,
    closeMobileNav: closeMobileNav
  };
})(jQuery);

(function() {
  var selectors = {
    backButton: '.return-link'
  };

  var $backButton = $(selectors.backButton);

  if (!document.referrer || !$backButton.length || !window.history.length) {
    return;
  }

  $backButton.one('click', function(evt) {
    evt.preventDefault();

    var referrerDomain = urlDomain(document.referrer);
    var shopDomain = urlDomain(window.location.href);

    if (shopDomain === referrerDomain) {
      history.back();
    }

    return false;
  });

  function urlDomain(url) {
    var anchor = document.createElement('a');
    anchor.ref = url;

    return anchor.hostname;
  }
})();

theme.Slideshow = (function() {
  this.$slideshow = null;
  var classes = {
    slideshow: 'slideshow',
    slickActiveMobile: 'slick-active-mobile',
    controlsHover: 'slideshow__controls--hover',
    isPaused: 'is-paused'
  };

  var selectors = {
    section: '.shopify-section',
    wrapper: '#SlideshowWrapper-',
    slides: '.slideshow__slide',
    textWrapperMobile: '.slideshow__text-wrap--mobile',
    textContentMobile: '.slideshow__text-content--mobile',
    controls: '.slideshow__controls',
    pauseButton: '.slideshow__pause',
    dots: '.slick-dots',
    arrows: '.slideshow__arrows',
    arrowsMobile: '.slideshow__arrows--mobile',
    arrowLeft: '.slideshow__arrow-left',
    arrowRight: '.slideshow__arrow-right'
  };

  function slideshow(el, sectionId) {
    var $slideshow = (this.$slideshow = $(el));
    this.adaptHeight = this.$slideshow.data('adapt-height');
    this.$wrapper = this.$slideshow.closest(selectors.wrapper + sectionId);
    this.$section = this.$wrapper.closest(selectors.section);
    this.$controls = this.$wrapper.find(selectors.controls);
    this.$arrows = this.$section.find(selectors.arrows);
    this.$arrowsMobile = this.$section.find(selectors.arrowsMobile);
    this.$pause = this.$controls.find(selectors.pauseButton);
    this.$textWrapperMobile = this.$section.find(selectors.textWrapperMobile);
    this.autorotate = this.$slideshow.data('autorotate');
    var autoplaySpeed = this.$slideshow.data('speed');
    var loadSlideA11yString = this.$slideshow.data('slide-nav-a11y');

    this.settings = {
      accessibility: true,
      arrows: false,
      dots: true,
      fade: true,
      draggable: true,
      touchThreshold: 20,
      autoplay: this.autorotate,
      autoplaySpeed: autoplaySpeed,
      // eslint-disable-next-line shopify/jquery-dollar-sign-reference
      appendDots: this.$arrows,
      customPaging: function(slick, index) {
        return (
          '<a href="' +
          selectors.wrapper +
          sectionId +
          '" aria-label="' +
          loadSlideA11yString.replace('[slide_number]', index + 1) +
          '" data-slide-number="' +
          index +
          '"></a>'
        );
      }
    };

    this.$slideshow.on('beforeChange', beforeChange.bind(this));
    this.$slideshow.on('init', slideshowA11ySetup.bind(this));

    // Add class to style mobile dots & show the correct text content for the
    // first slide on mobile when the slideshow initialises
    this.$slideshow.on(
      'init',
      function() {
        this.$mobileDots
          .find('li:first-of-type')
          .addClass(classes.slickActiveMobile);
        this.showMobileText(0);
      }.bind(this)
    );

    // Stop the autorotate when you scroll past the mobile controls, resume when
    // they are scrolled back into view
    if (this.autorotate) {
      $(document).scroll(
        $.debounce(
          250,
          function() {
            if (
              this.$arrowsMobile.offset().top +
                this.$arrowsMobile.outerHeight() <
              window.pageYOffset
            ) {
              $slideshow.slick('slickPause');
            } else if (!this.$pause.hasClass(classes.isPaused)) {
              $slideshow.slick('slickPlay');
            }
          }.bind(this)
        )
      );
    }

    if (this.adaptHeight) {
      this.setSlideshowHeight();
      $(window).resize($.debounce(50, this.setSlideshowHeight.bind(this)));
    }

    this.$slideshow.slick(this.settings);

    // This can't be called when the slick 'init' event fires due to how slick
    // adds a11y features.
    slideshowPostInitA11ySetup.bind(this)();

    this.$arrows.find(selectors.arrowLeft).on('click', function() {
      $slideshow.slick('slickPrev');
    });
    this.$arrows.find(selectors.arrowRight).on('click', function() {
      $slideshow.slick('slickNext');
    });

    this.$pause.on('click', this.togglePause.bind(this));
  }

  function slideshowA11ySetup(event, obj) {
    var $slider = obj.$slider;
    var $list = obj.$list;
    this.$dots = this.$section.find(selectors.dots);
    this.$mobileDots = this.$dots.eq(1);

    // Remove default Slick aria-live attr until slider is focused
    $list.removeAttr('aria-live');

    this.$wrapper.on('keyup', keyboardNavigation.bind(this));
    this.$controls.on('keyup', keyboardNavigation.bind(this));
    this.$textWrapperMobile.on('keyup', keyboardNavigation.bind(this));

    // When an element in the slider is focused
    // pause slideshow and set aria-live.
    this.$wrapper
      .on(
        'focusin',
        function(evt) {
          if (!this.$wrapper.has(evt.target).length) {
            return;
          }

          $list.attr('aria-live', 'polite');
          if (this.autorotate) {
            $slider.slick('slickPause');
          }
        }.bind(this)
      )
      .on(
        'focusout',
        function(evt) {
          if (!this.$wrapper.has(evt.target).length) {
            return;
          }

          $list.removeAttr('aria-live');
          if (this.autorotate) {
            // Only resume playing if the user hasn't paused using the pause
            // button
            if (!this.$pause.is('.is-paused')) {
              $slider.slick('slickPlay');
            }
          }
        }.bind(this)
      );

    // Add arrow key support when focused
    if (this.$dots) {
      this.$dots
        .find('a')
        .each(function() {
          var $dot = $(this);
          $dot.on('click keyup', function(evt) {
            if (
              evt.type === 'keyup' &&
              evt.which !== slate.utils.keyboardKeys.ENTER
            )
              return;

            evt.preventDefault();

            var slideNumber = $(evt.target).data('slide-number');

            $slider.attr('tabindex', -1).slick('slickGoTo', slideNumber);

            if (evt.type === 'keyup') {
              $slider.focus();
            }
          });
        })
        .eq(0)
        .attr('aria-current', 'true');
    }

    this.$controls
      .on('focusin', highlightControls.bind(this))
      .on('focusout', unhighlightControls.bind(this));
  }

  function slideshowPostInitA11ySetup() {
    var $slides = this.$slideshow.find(selectors.slides);

    $slides.removeAttr('role').removeAttr('aria-labelledby');
    this.$dots
      .removeAttr('role')
      .find('li')
      .removeAttr('role')
      .removeAttr('aria-selected')
      .each(function() {
        var $dot = $(this);
        var ariaControls = $dot.attr('aria-controls');
        $dot
          .removeAttr('aria-controls')
          .find('a')
          .attr('aria-controls', ariaControls);
      });
  }

  function beforeChange(event, slick, currentSlide, nextSlide) {
    var $dotLinks = this.$dots.find('a');
    var $mobileDotLinks = this.$mobileDots.find('li');

    $dotLinks
      .removeAttr('aria-current')
      .eq(nextSlide)
      .attr('aria-current', 'true');

    $mobileDotLinks
      .removeClass(classes.slickActiveMobile)
      .eq(nextSlide)
      .addClass(classes.slickActiveMobile);
    this.showMobileText(nextSlide);
  }

  function keyboardNavigation() {
    if (event.keyCode === slate.utils.keyboardKeys.LEFTARROW) {
      this.$slideshow.slick('slickPrev');
    }
    if (event.keyCode === slate.utils.keyboardKeys.RIGHTARROW) {
      this.$slideshow.slick('slickNext');
    }
  }

  function highlightControls() {
    this.$controls.addClass(classes.controlsHover);
  }

  function unhighlightControls() {
    this.$controls.removeClass(classes.controlsHover);
  }

  slideshow.prototype.togglePause = function() {
    var slideshowSelector = getSlideshowId(this.$pause);
    if (this.$pause.hasClass(classes.isPaused)) {
      this.$pause.removeClass(classes.isPaused).attr('aria-pressed', 'false');
      if (this.autorotate) {
        $(slideshowSelector).slick('slickPlay');
      }
    } else {
      this.$pause.addClass(classes.isPaused).attr('aria-pressed', 'true');
      if (this.autorotate) {
        $(slideshowSelector).slick('slickPause');
      }
    }
  };

  slideshow.prototype.setSlideshowHeight = function() {
    var minAspectRatio = this.$slideshow.data('min-aspect-ratio');
    this.$slideshow.height($(document).width() / minAspectRatio);
  };

  slideshow.prototype.showMobileText = function(slideIndex) {
    var $allTextContent = this.$textWrapperMobile.find(
      selectors.textContentMobile
    );
    var currentTextContentSelector =
      selectors.textContentMobile + '-' + slideIndex;
    var $currentTextContent = this.$textWrapperMobile.find(
      currentTextContentSelector
    );
    if (
      !$currentTextContent.length &&
      this.$slideshow.find(selectors.slides).length === 1
    ) {
      this.$textWrapperMobile.hide();
    } else {
      this.$textWrapperMobile.show();
    }
    $allTextContent.hide();
    $currentTextContent.show();
  };

  function getSlideshowId($el) {
    return '#Slideshow-' + $el.data('id');
  }

  return slideshow;
})();

theme.Video = (function() {
  var autoplayCheckComplete = false;
  var playOnClickChecked = false;
  var playOnClick = false;
  var youtubeLoaded = false;
  var videos = {};
  var videoPlayers = [];
  var videoOptions = {
    ratio: 16 / 9,
    scrollAnimationDuration: 400,
    playerVars: {
      // eslint-disable-next-line camelcase
      iv_load_policy: 3,
      modestbranding: 1,
      autoplay: 0,
      controls: 0,
      wmode: 'opaque',
      branding: 0,
      autohide: 0,
      rel: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerChange
    }
  };
  var classes = {
    playing: 'video-is-playing',
    paused: 'video-is-paused',
    loading: 'video-is-loading',
    loaded: 'video-is-loaded',
    backgroundVideoWrapper: 'video-background-wrapper',
    videoWithImage: 'video--image_with_play',
    backgroundVideo: 'video--background',
    userPaused: 'is-paused',
    supportsAutoplay: 'autoplay',
    supportsNoAutoplay: 'no-autoplay',
    wrapperMinHeight: 'video-section-wrapper--min-height'
  };

  var selectors = {
    section: '.video-section',
    videoWrapper: '.video-section-wrapper',
    playVideoBtn: '.video-control__play',
    closeVideoBtn: '.video-control__close-wrapper',
    pauseVideoBtn: '.video__pause',
    pauseVideoStop: '.video__pause-stop',
    pauseVideoResume: '.video__pause-resume',
    fallbackText: '.icon__fallback-text'
  };

  /**
   * Public functions
   */
  function init($video) {
    if (!$video.length) {
      return;
    }

    videos[$video.attr('id')] = {
      id: $video.attr('id'),
      videoId: $video.data('id'),
      type: $video.data('type'),
      status:
        $video.data('type') === 'image_with_play' ? 'closed' : 'background', // closed, open, background
      $video: $video,
      $videoWrapper: $video.closest(selectors.videoWrapper),
      $section: $video.closest(selectors.section),
      controls: $video.data('type') === 'background' ? 0 : 1
    };

    if (!youtubeLoaded) {
      // This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    playOnClickCheck();
  }

  function customPlayVideo(playerId) {
    // Make sure we have carried out the playOnClick check first
    if (!playOnClickChecked && !playOnClick) {
      return;
    }

    if (playerId && typeof videoPlayers[playerId].playVideo === 'function') {
      privatePlayVideo(playerId);
    }
  }

  function pauseVideo(playerId) {
    if (
      videoPlayers[playerId] &&
      typeof videoPlayers[playerId].pauseVideo === 'function'
    ) {
      videoPlayers[playerId].pauseVideo();
    }
  }

  function loadVideos() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        createPlayer(key);
      }
    }

    initEvents();
    youtubeLoaded = true;
  }

  function editorLoadVideo(key) {
    if (!youtubeLoaded) {
      return;
    }
    createPlayer(key);

    initEvents();
  }

  /**
   * Private functions
   */

  function privatePlayVideo(id, clicked) {
    var videoData = videos[id];
    var player = videoPlayers[id];
    var $videoWrapper = videoData.$videoWrapper;

    if (playOnClick) {
      // playOnClick means we are probably on mobile (no autoplay).
      // setAsPlaying will show the iframe, requiring another click
      // to play the video.
      setAsPlaying(videoData);
    } else if (clicked || autoplayCheckComplete) {
      // Play if autoplay is available or clicked to play
      $videoWrapper.removeClass(classes.loading);
      setAsPlaying(videoData);
      player.playVideo();
      return;
    } else {
      player.playVideo();
    }
  }

  function setAutoplaySupport(supported) {
    var supportClass = supported
      ? classes.supportsAutoplay
      : classes.supportsNoAutoplay;
    $(document.documentElement)
      .removeClass(classes.supportsAutoplay)
      .removeClass(classes.supportsNoAutoplay)
      .addClass(supportClass);

    if (!supported) {
      playOnClick = true;
    }

    autoplayCheckComplete = true;
  }

  function playOnClickCheck() {
    // Bail early for a few instances:
    // - small screen
    // - device sniff mobile browser

    if (playOnClickChecked) {
      return;
    }

    if (isMobile()) {
      playOnClick = true;
    }

    if (playOnClick) {
      // No need to also do the autoplay check
      setAutoplaySupport(false);
    }

    playOnClickChecked = true;
  }

  // The API will call this function when each video player is ready
  function onPlayerReady(evt) {
    evt.target.setPlaybackQuality('hd1080');
    var videoData = getVideoOptions(evt);
    var videoTitle = evt.target.getVideoData().title;
    playOnClickCheck();

    // Prevent tabbing through YouTube player controls until visible
    $('#' + videoData.id).attr('tabindex', '-1');

    sizeBackgroundVideos();
    setButtonLabels(videoData.$videoWrapper, videoTitle);

    // Customize based on options from the video ID
    if (videoData.type === 'background') {
      evt.target.mute();
      privatePlayVideo(videoData.id);
    }

    videoData.$videoWrapper.addClass(classes.loaded);
  }

  function onPlayerChange(evt) {
    var videoData = getVideoOptions(evt);
    if (
      videoData.status === 'background' &&
      !isMobile() &&
      !autoplayCheckComplete &&
      (evt.data === YT.PlayerState.PLAYING ||
        evt.data === YT.PlayerState.BUFFERING)
    ) {
      setAutoplaySupport(true);
      autoplayCheckComplete = true;
      videoData.$videoWrapper.removeClass(classes.loading);
    }
    switch (evt.data) {
      case YT.PlayerState.ENDED:
        setAsFinished(videoData);
        break;
      case YT.PlayerState.PAUSED:
        // Seeking on a YouTube video also fires a PAUSED state change,
        // checking the state after a delay prevents us pausing the video when
        // the user is seeking instead of pausing
        setTimeout(function() {
          if (evt.target.getPlayerState() === YT.PlayerState.PAUSED) {
            setAsPaused(videoData);
          }
        }, 200);
        break;
    }
  }

  function setAsFinished(videoData) {
    switch (videoData.type) {
      case 'background':
        videoPlayers[videoData.id].seekTo(0);
        break;
      case 'image_with_play':
        closeVideo(videoData.id);
        toggleExpandVideo(videoData.id, false);
        break;
    }
  }

  function setAsPlaying(videoData) {
    var $videoWrapper = videoData.$videoWrapper;
    var $pauseButton = $videoWrapper.find(selectors.pauseVideoBtn);

    $videoWrapper.removeClass(classes.loading);

    if ($pauseButton.hasClass(classes.userPaused)) {
      $pauseButton.removeClass(classes.userPaused);
    }

    // Do not change element visibility if it is a background video
    if (videoData.status === 'background') {
      return;
    }

    $('#' + videoData.id).attr('tabindex', '0');

    if (videoData.type === 'image_with_play') {
      $videoWrapper.removeClass(classes.paused).addClass(classes.playing);
    }

    // Update focus to the close button so we stay within the video wrapper,
    // allowing time for the scroll animation
    setTimeout(function() {
      $videoWrapper.find(selectors.closeVideoBtn).focus();
    }, videoOptions.scrollAnimationDuration);
  }

  function setAsPaused(videoData) {
    var $videoWrapper = videoData.$videoWrapper;

    // YT's events fire after our click event. This status flag ensures
    // we don't interact with a closed or background video.
    if (videoData.type === 'image_with_play') {
      if (videoData.status === 'closed') {
        $videoWrapper.removeClass(classes.paused);
      } else {
        $videoWrapper.addClass(classes.paused);
      }
    }

    $videoWrapper.removeClass(classes.playing);
  }

  function closeVideo(playerId) {
    var videoData = videos[playerId];
    var $videoWrapper = videoData.$videoWrapper;
    var classesToRemove = [classes.paused, classes.playing].join(' ');

    if (isMobile()) {
      $videoWrapper.removeAttr('style');
    }

    $('#' + videoData.id).attr('tabindex', '-1');

    videoData.status = 'closed';

    switch (videoData.type) {
      case 'image_with_play':
        videoPlayers[playerId].stopVideo();
        setAsPaused(videoData); // in case the video is already paused
        break;
      case 'background':
        videoPlayers[playerId].mute();
        setBackgroundVideo(playerId);
        break;
    }

    $videoWrapper.removeClass(classesToRemove);
  }

  function getVideoOptions(evt) {
    var id = evt.target.getIframe().id;
    return videos[id];
  }

  function toggleExpandVideo(playerId, expand) {
    var video = videos[playerId];
    var elementTop = video.$videoWrapper.offset().top;
    var $playButton = video.$videoWrapper.find(selectors.playVideoBtn);
    var offset = 0;
    var newHeight = 0;

    if (isMobile()) {
      video.$videoWrapper.parent().toggleClass('page-width', !expand);
    }

    if (expand) {
      if (isMobile()) {
        newHeight = $(window).width() / videoOptions.ratio;
      } else {
        newHeight = video.$videoWrapper.width() / videoOptions.ratio;
      }
      offset = ($(window).height() - newHeight) / 2;

      video.$videoWrapper
        .removeClass(classes.wrapperMinHeight)
        .animate({ height: newHeight }, 600);

      // Animate doesn't work in mobile editor, so we don't use it
      if (!(isMobile() && Shopify.designMode)) {
        $('html, body').animate(
          {
            scrollTop: elementTop - offset
          },
          videoOptions.scrollAnimationDuration
        );
      }
    } else {
      if (isMobile()) {
        newHeight = video.$videoWrapper.data('mobile-height');
      } else {
        newHeight = video.$videoWrapper.data('desktop-height');
      }

      video.$videoWrapper
        .height(video.$videoWrapper.width() / videoOptions.ratio)
        .animate({ height: newHeight }, 600);
      setTimeout(function() {
        video.$videoWrapper.addClass(classes.wrapperMinHeight);
      }, 600);
      $playButton.focus();
    }
  }

  function togglePause(playerId) {
    var $pauseButton = videos[playerId].$videoWrapper.find(
      selectors.pauseVideoBtn
    );
    var paused = $pauseButton.hasClass(classes.userPaused);
    if (paused) {
      $pauseButton.removeClass(classes.userPaused);
      customPlayVideo(playerId);
    } else {
      $pauseButton.addClass(classes.userPaused);
      pauseVideo(playerId);
    }
    $pauseButton.attr('aria-pressed', !paused);
  }

  function startVideoOnClick(playerId) {
    var video = videos[playerId];

    // add loading class to wrapper
    video.$videoWrapper.addClass(classes.loading);

    // Explicity set the video wrapper height (needed for height transition)
    video.$videoWrapper.attr(
      'style',
      'height: ' + video.$videoWrapper.height() + 'px'
    );

    video.status = 'open';

    switch (video.type) {
      case 'image_with_play':
        privatePlayVideo(playerId, true);
        break;
      case 'background':
        unsetBackgroundVideo(playerId, video);
        videoPlayers[playerId].unMute();
        privatePlayVideo(playerId, true);
        break;
    }

    toggleExpandVideo(playerId, true);

    // esc to close video player
    $(document).on('keydown.videoPlayer', function(evt) {
      var playerId = $(document.activeElement).data('controls');
      if (evt.keyCode !== slate.utils.keyboardKeys.ESCAPE || !playerId) {
        return;
      }

      closeVideo(playerId);
      toggleExpandVideo(playerId, false);
    });
  }

  function sizeBackgroundVideos() {
    $('.' + classes.backgroundVideo).each(function(index, el) {
      sizeBackgroundVideo($(el));
    });
  }

  function sizeBackgroundVideo($videoPlayer) {
    if (!youtubeLoaded) {
      return;
    }

    if (isMobile()) {
      $videoPlayer.removeAttr('style');
    } else {
      var $videoWrapper = $videoPlayer.closest(selectors.videoWrapper);
      var videoWidth = $videoWrapper.width();
      var playerWidth = $videoPlayer.width();
      var desktopHeight = $videoWrapper.data('desktop-height');

      // when screen aspect ratio differs from video, video must center and underlay one dimension
      if (videoWidth / videoOptions.ratio < desktopHeight) {
        playerWidth = Math.ceil(desktopHeight * videoOptions.ratio); // get new player width
        $videoPlayer
          .width(playerWidth)
          .height(desktopHeight)
          .css({
            left: (videoWidth - playerWidth) / 2,
            top: 0
          }); // player width is greater, offset left; reset top
      } else {
        // new video width < window width (gap to right)
        desktopHeight = Math.ceil(videoWidth / videoOptions.ratio); // get new player height
        $videoPlayer
          .width(videoWidth)
          .height(desktopHeight)
          .css({
            left: 0,
            top: (desktopHeight - desktopHeight) / 2
          }); // player height is greater, offset top; reset left
      }

      $videoPlayer.prepareTransition();
      $videoWrapper.addClass(classes.loaded);
    }
  }

  function unsetBackgroundVideo(playerId) {
    // Switch the background video to a chrome-only player once played
    $('#' + playerId)
      .removeClass(classes.backgroundVideo)
      .addClass(classes.videoWithImage);

    setTimeout(function() {
      $('#' + playerId).removeAttr('style');
    }, 600);

    videos[playerId].$videoWrapper
      .removeClass(classes.backgroundVideoWrapper)
      .addClass(classes.playing);

    videos[playerId].status = 'open';
  }

  function setBackgroundVideo(playerId) {
    $('#' + playerId)
      .removeClass(classes.videoWithImage)
      .addClass(classes.backgroundVideo);

    videos[playerId].$videoWrapper.addClass(classes.backgroundVideoWrapper);

    videos[playerId].status = 'background';
    sizeBackgroundVideo($('#' + playerId));
  }

  function isMobile() {
    return $(window).width() < 750 || window.mobileCheck();
  }

  function initEvents() {
    $(document).on('click.videoPlayer', selectors.playVideoBtn, function(evt) {
      var playerId = $(evt.currentTarget).data('controls');

      startVideoOnClick(playerId);
    });

    $(document).on('click.videoPlayer', selectors.closeVideoBtn, function(evt) {
      var playerId = $(evt.currentTarget).data('controls');

      $(evt.currentTarget).blur();
      closeVideo(playerId);
      toggleExpandVideo(playerId, false);
    });

    $(document).on('click.videoPlayer', selectors.pauseVideoBtn, function(evt) {
      var playerId = $(evt.currentTarget).data('controls');
      togglePause(playerId);
    });

    // Listen to resize to keep a background-size:cover-like layout
    $(window).on(
      'resize.videoPlayer',
      $.debounce(200, function() {
        if (!youtubeLoaded) return;
        var key;
        var fullscreen = window.innerHeight === screen.height;

        sizeBackgroundVideos();

        if (isMobile()) {
          for (key in videos) {
            if (videos.hasOwnProperty(key)) {
              if (videos[key].$videoWrapper.hasClass(classes.playing)) {
                if (!fullscreen) {
                  pauseVideo(key);
                  setAsPaused(videos[key]);
                }
              }
              videos[key].$videoWrapper.height(
                $(document).width() / videoOptions.ratio
              );
            }
          }
          setAutoplaySupport(false);
        } else {
          setAutoplaySupport(true);
          for (key in videos) {
            if (
              videos[key].$videoWrapper.find('.' + classes.videoWithImage)
                .length
            ) {
              continue;
            }
            videoPlayers[key].playVideo();
            setAsPlaying(videos[key]);
          }
        }
      })
    );

    $(window).on(
      'scroll.videoPlayer',
      $.debounce(50, function() {
        if (!youtubeLoaded) return;

        for (var key in videos) {
          if (videos.hasOwnProperty(key)) {
            var $videoWrapper = videos[key].$videoWrapper;

            // Close the video if more than 75% of it is scrolled out of view
            if (
              $videoWrapper.hasClass(classes.playing) &&
              ($videoWrapper.offset().top + $videoWrapper.height() * 0.75 <
                $(window).scrollTop() ||
                $videoWrapper.offset().top + $videoWrapper.height() * 0.25 >
                  $(window).scrollTop() + $(window).height())
            ) {
              closeVideo(key);
              toggleExpandVideo(key, false);
            }
          }
        }
      })
    );
  }

  function createPlayer(key) {
    var args = $.extend({}, videoOptions, videos[key]);
    args.playerVars.controls = args.controls;
    videoPlayers[key] = new YT.Player(key, args);
  }

  function removeEvents() {
    $(document).off('.videoPlayer');
    $(window).off('.videoPlayer');
  }

  function setButtonLabels($videoWrapper, title) {
    var $playButtons = $videoWrapper.find(selectors.playVideoBtn);
    var $closeButton = $videoWrapper.find(selectors.closeVideoBtn);
    var $pauseButton = $videoWrapper.find(selectors.pauseVideoBtn);
    var $closeButtonText = $closeButton.find(selectors.fallbackText);
    var $pauseButtonStopText = $pauseButton
      .find(selectors.pauseVideoStop)
      .find(selectors.fallbackText);
    var $pauseButtonResumeText = $pauseButton
      .find(selectors.pauseVideoResume)
      .find(selectors.fallbackText);

    // Insert the video title retrieved from YouTube into the instructional text
    // for each button
    $playButtons.each(function() {
      var $playButton = $(this);
      var $playButtonText = $playButton.find(selectors.fallbackText);

      $playButtonText.text(
        $playButtonText.text().replace('[video_title]', title)
      );
    });
    $closeButtonText.text(
      $closeButtonText.text().replace('[video_title]', title)
    );
    $pauseButtonStopText.text(
      $pauseButtonStopText.text().replace('[video_title]', title)
    );
    $pauseButtonResumeText.text(
      $pauseButtonResumeText.text().replace('[video_title]', title)
    );
  }

  return {
    init: init,
    editorLoadVideo: editorLoadVideo,
    loadVideos: loadVideos,
    playVideo: customPlayVideo,
    pauseVideo: pauseVideo,
    removeEvents: removeEvents
  };
})();

theme.ProductVideo = (function() {
  var videos = {};

  var hosts = {
    html5: 'html5',
    youtube: 'youtube'
  };

  var selectors = {
    productMediaWrapper: '[data-product-single-media-wrapper]'
  };

  var attributes = {
    enableVideoLooping: 'enable-video-looping',
    videoId: 'video-id'
  };

  function init(videoContainer, sectionId) {
    if (!videoContainer.length) {
      return;
    }

    var videoElement = videoContainer.find('iframe, video')[0];
    var mediaId = videoContainer.data('mediaId');

    if (!videoElement) {
      return;
    }

    videos[mediaId] = {
      mediaId: mediaId,
      sectionId: sectionId,
      host: hostFromVideoElement(videoElement),
      container: videoContainer,
      element: videoElement,
      ready: function() {
        createPlayer(this);
      }
    };

    var video = videos[mediaId];

    switch (video.host) {
      case hosts.html5:
        window.Shopify.loadFeatures([
          {
            name: 'video-ui',
            version: '1.0',
            onLoad: setupPlyrVideos
          }
        ]);
        theme.LibraryLoader.load('plyrShopifyStyles');
        break;
      case hosts.youtube:
        theme.LibraryLoader.load('youtubeSdk', setupYouTubeVideos);
        break;
    }
  }

  function setupPlyrVideos(errors) {
    if (errors) {
      fallbackToNativeVideo();
      return;
    }

    loadVideos(hosts.html5);
  }

  function setupYouTubeVideos() {
    if (!window.YT.Player) return;

    loadVideos(hosts.youtube);
  }

  function createPlayer(video) {
    if (video.player) {
      return;
    }

    var productMediaWrapper = video.container.closest(
      selectors.productMediaWrapper
    );
    var enableLooping = productMediaWrapper.data(attributes.enableVideoLooping);

    switch (video.host) {
      case hosts.html5:
        // eslint-disable-next-line no-undef
        video.player = new Shopify.Plyr(video.element, {
          loop: { active: enableLooping }
        });
        break;
      case hosts.youtube:
        var videoId = productMediaWrapper.data(attributes.videoId);

        video.player = new YT.Player(video.element, {
          videoId: videoId,
          events: {
            onStateChange: function(event) {
              if (event.data === 0 && enableLooping) event.target.seekTo(0);
            }
          }
        });
        break;
    }

    productMediaWrapper.on('mediaHidden xrLaunch', function() {
      if (!video.player) return;

      if (video.host === hosts.html5) {
        video.player.pause();
      }

      if (video.host === hosts.youtube && video.player.pauseVideo) {
        video.player.pauseVideo();
      }
    });

    productMediaWrapper.on('mediaVisible', function() {
      if (theme.Helpers.isTouch()) return;
      if (!video.player) return;

      if (video.host === hosts.html5) {
        video.player.play();
      }

      if (video.host === hosts.youtube && video.player.playVideo) {
        video.player.playVideo();
      }
    });
  }

  function hostFromVideoElement(video) {
    if (video.tagName === 'VIDEO') {
      return hosts.html5;
    }

    if (video.tagName === 'IFRAME') {
      if (
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(
          video.src
        )
      ) {
        return hosts.youtube;
      }
    }
    return null;
  }

  function loadVideos(host) {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];
        if (video.host === host) {
          video.ready();
        }
      }
    }
  }

  function fallbackToNativeVideo() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];

        if (video.nativeVideo) continue;

        if (video.host === hosts.html5) {
          video.element.setAttribute('controls', 'controls');
          video.nativeVideo = true;
        }
      }
    }
  }

  function removeSectionVideos(sectionId) {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];

        if (video.sectionId === sectionId) {
          if (video.player) video.player.destroy();
          delete videos[key];
        }
      }
    }
  }

  return {
    init: init,
    hosts: hosts,
    loadVideos: loadVideos,
    removeSectionVideos: removeSectionVideos
  };
})();

theme.ProductModel = (function() {
  var modelJsonSections = {};
  var models = {};
  var xrButtons = {};

  var selectors = {
    mediaGroup: '[data-product-single-media-group]',
    xrButton: '[data-shopify-xr]'
  };

  function init(modelViewerContainers, sectionId) {
    modelJsonSections[sectionId] = {
      loaded: false
    };

    modelViewerContainers.each(function(index) {
      var $modelViewerContainer = $(this);
      var mediaId = $modelViewerContainer.data('media-id');
      var $modelViewerElement = $(
        $modelViewerContainer.find('model-viewer')[0]
      );
      var modelId = $modelViewerElement.data('model-id');

      if (index === 0) {
        var $xrButton = $modelViewerContainer
          .closest(selectors.mediaGroup)
          .find(selectors.xrButton);
        xrButtons[sectionId] = {
          $element: $xrButton,
          defaultId: modelId
        };
      }

      models[mediaId] = {
        modelId: modelId,
        sectionId: sectionId,
        $container: $modelViewerContainer,
        $element: $modelViewerElement
      };
    });

    window.Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: setupShopifyXr
      },
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: setupModelViewerUi
      }
    ]);
    theme.LibraryLoader.load('modelViewerUiStyles');
  }

  function setupShopifyXr(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', function() {
        setupShopifyXr();
      });
      return;
    }

    for (var sectionId in modelJsonSections) {
      if (modelJsonSections.hasOwnProperty(sectionId)) {
        var modelSection = modelJsonSections[sectionId];

        if (modelSection.loaded) continue;
        var $modelJson = $('#ModelJson-' + sectionId);

        window.ShopifyXR.addModels(JSON.parse($modelJson.html()));
        modelSection.loaded = true;
      }
    }
    window.ShopifyXR.setupXRElements();
  }

  function setupModelViewerUi(errors) {
    if (errors) return;

    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (!model.modelViewerUi) {
          model.modelViewerUi = new Shopify.ModelViewerUI(model.$element);
        }
        setupModelViewerListeners(model);
      }
    }
  }

  function setupModelViewerListeners(model) {
    var xrButton = xrButtons[model.sectionId];

    model.$container.on('mediaVisible', function() {
      xrButton.$element.attr('data-shopify-model3d-id', model.modelId);
      if (theme.Helpers.isTouch()) return;
      model.modelViewerUi.play();
    });

    model.$container
      .on('mediaHidden', function() {
        xrButton.$element.attr('data-shopify-model3d-id', xrButton.defaultId);
        model.modelViewerUi.pause();
      })
      .on('xrLaunch', function() {
        model.modelViewerUi.pause();
      });
  }

  function removeSectionModels(sectionId) {
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (model.sectionId === sectionId) {
          models[key].modelViewerUi.destroy();
          delete models[key];
        }
      }
    }
    delete modelJsonSections[sectionId];
  }

  return {
    init: init,
    removeSectionModels: removeSectionModels
  };
})();

window.theme = window.theme || {};

theme.FormStatus = (function() {
  var selectors = {
    statusMessage: '[data-form-status]'
  };

  function init() {
    this.$statusMessage = $(selectors.statusMessage);

    if (!this.$statusMessage) return;

    this.$statusMessage.attr('tabindex', -1).focus();

    this.$statusMessage.on('blur', handleBlur.bind(this));
  }

  function handleBlur() {
    this.$statusMessage.removeAttr('tabindex');
  }

  return {
    init: init
  };
})();

theme.Hero = (function() {
  var classes = {
    indexSectionFlush: 'index-section--flush'
  };

  var selectors = {
    heroFixedWidthContent: '.hero-fixed-width__content',
    heroFixedWidthImage: '.hero-fixed-width__image'
  };

  function hero(el, sectionId) {
    this.$hero = $(el);
    this.layout = this.$hero.data('layout');
    var $parentSection = $('#shopify-section-' + sectionId);
    var $heroContent = $parentSection.find(selectors.heroFixedWidthContent);
    var $heroImage = $parentSection.find(selectors.heroFixedWidthImage);

    if (this.layout !== 'fixed_width') {
      return;
    }

    $parentSection.removeClass(classes.indexSectionFlush);
    heroFixedHeight();
    $(window).resize(
      $.debounce(50, function() {
        heroFixedHeight();
      })
    );

    function heroFixedHeight() {
      var contentHeight = $heroContent.height() + 50;
      var imageHeight = $heroImage.height();

      if (contentHeight > imageHeight) {
        $heroImage.css('min-height', contentHeight);
      }
    }
  }

  return hero;
})();

// prettier-ignore
window.theme = window.theme || {};

theme.SearchResultsTemplate = (function() {
  function renderResults(products, isLoading, searchQuery) {
    return [
      '<div class="predictive-search">',
      renderHeader(products, isLoading),
      renderProducts(products, searchQuery),
      '</div>'
    ].join('');
  }

  function renderHeader(products, isLoading) {
    if (products.length === 0) {
      return '';
    }

    return [
      '<div class="predictive-search-title">',
      '<h3 id="predictive-search" class="predictive-search-title__content">' +
        theme.strings.products +
        '</h3>',
      '<span class="predictive-search-title__loading-spinner">' +
        (isLoading
          ? '<span class= "icon-predictive-search-spinner" ></span >'
          : '') +
        '</span>',
      '</div>'
    ].join('');
  }

  function loadingState() {
    return [
      '<div class="predictive-search">',
      '<div class="predictive-search-loading">',
      '<span class="visually-hidden">' + theme.strings.loading + '</span>',
      '<span class="predictive-search-loading__icon">',
      '<span class="icon-predictive-search-spinner"></span>',
      '</span>',
      '</div>',
      '</div>'
    ].join('');
  }

  function renderViewAll(searchQuery) {
    return [
      '<button type="submit" class="predictive-search-view-all__button" tabindex="-1">',
      theme.strings.searchFor +
        '<span class="predictive-search-view-all__query"> &ldquo;' +
        _htmlEscape(searchQuery) +
        '&rdquo;</span>',
      '</button>'
    ].join('');
  }

  function renderProducts(products, searchQuery) {
    var resultsCount = products.length;

    return [
      '<ul id="predictive-search-results" class="predictive-search__list" role="listbox" aria-labelledby="predictive-search">',
      products
        .map(function(product, index) {
          return renderProduct(normalizeProduct(product), index, resultsCount);
        })
        .join(''),
      '<li id="search-all" class="predictive-search-view-all" role="option" data-search-result>' +
        renderViewAll(searchQuery) +
        '</li>',
      '</ul>'
    ].join('');
  }

  function renderProduct(product, index, resultsCount) {
    return [
      '<li id="search-result-' +
        index +
        '" class="predictive-search-item" role="option" data-search-result>',
      '<a class="predictive-search-item__link" href="' +
        product.url +
        '" tabindex="-1">',
      '<div class="predictive-search__column predictive-search__column--image" data-image-with-placeholder-wrapper>',
      renderProductImage(product),
      '</div>',
      '<div class="predictive-search__column predictive-search__column--content ' +
        (getDetailsCount() ? '' : 'predictive-search__column--center') +
        '">',
      '<span class="predictive-search-item__title">',
      '<span class="predictive-search-item__title-text">' +
        product.title +
        '</span>',
      '</span>' + (getDetailsCount() ? renderProductDetails(product) : ''),
      '<span class="visually-hidden">, </span>',
      '<span class="visually-hidden">' +
        getNumberOfResultsString(index + 1, resultsCount) +
        '</span>',
      '</div>',
      '</a>',
      '</li>'
    ].join('');
  }

  function renderProductImage(product) {
    if (product.image === null) {
      return '';
    }

    return [
      '<div class="placeholder-background placeholder-background--animation" data-image-placeholder aria-hidden="true"></div>',
      '<img class="predictive-search-item__image lazyload" src="' +
        product.image.url +
        '" data-src="' +
        product.image.url +
        '" data-image alt="' +
        product.image.alt +
        '" />'
    ].join('');
  }

  function renderProductDetails(product) {
    return [
      '<dl class="predictive-search-item__details price' +
        (product.isOnSale ? ' price--on-sale' : '') +
        (!product.available ? ' price--sold-out' : '') +
        (!product.isPriceVaries && product.isCompareVaries
          ? ' price--compare-price-hidden'
          : '') +
        '">',
      '<div class="predictive-search-item__detail">',
      renderVendor(product),
      '</div>',
      '<div class="predictive-search-item__detail predictive-search-item__detail--inline">' +
        renderProductPrice(product),
      '</div>',
      '</dl>'
    ].join('');
  }
  function renderProductPrice(product) {
    if (!theme.settings.predictiveSearchShowPrice) {
      return '';
    }

    var accessibilityAnnounceComma = '<span class="visually-hidden">, </span>';

    var priceMarkup =
      '<div class="price__regular">' + renderPrice(product) + '</div>';

    var salePriceMarkup =
      '<div class="price__sale">' + renderSalePrice(product) + '</div>';

    return (
      accessibilityAnnounceComma +
      '<div class="price__pricing-group">' +
      (product.isOnSale ? salePriceMarkup : priceMarkup) +
      '</div>'
    );
  }

  function renderSalePrice(product) {
    return [
      '<dt>',
      '<span class="visually-hidden">' + theme.strings.salePrice + '</span>',
      '</dt>',
      '<dd>',
      '<span class="predictive-search-item__price predictive-search-item__price--sale">' +
        (product.isPriceVaries
          ? theme.strings.fromLowestPrice.replace('[price]', product.price)
          : product.price) +
        '</span>',
      '</dd>',
      '<div class="price__compare">' + renderCompareAtPrice(product) + '</div>'
    ].join('');
  }

  function renderCompareAtPrice(product) {
    return [
      '<dt>',
      '<span class="visually-hidden">' +
        theme.strings.regularPrice +
        '</span> ',
      '</dt>',
      '<dd>',
      '<span class="predictive-search-item__price predictive-search-item__price--compare">' +
        product.compareAtPrice +
        '</span>',
      '</dd>'
    ].join('');
  }

  function renderPrice(product) {
    return [
      '<dt>',
      '<span class="visually-hidden">' + theme.strings.regularPrice + '</span>',
      '</dt>',
      '<dd>',
      '<span class="predictive-search-item__price">' +
        (product.isPriceVaries
          ? theme.strings.fromLowestPrice.replace('[price]', product.price)
          : product.price) +
        '</span>',
      '</dd>'
    ].join('');
  }

  function renderVendor(product) {
    if (!theme.settings.predictiveSearchShowVendor || product.vendor === '') {
      return '';
    }

    return [
      '<dt>',
      '<span class="visually-hidden">' + theme.strings.vendor + '</span>',
      '</dt>',
      '<dd class="predictive-search-item__vendor">' + product.vendor + '</dd>'
    ].join('');
  }

  function normalizeProduct(product) {
    var productOrVariant =
      product.variants.length > 0 ? product.variants[0] : product;

    return {
      url: productOrVariant.url,
      image: getProductImage(product),
      title: product.title,
      vendor: product.vendor || '',
      price: theme.Currency.formatMoney(product.price_min, theme.moneyFormat),
      compareAtPrice: theme.Currency.formatMoney(
        product.compare_at_price_min,
        theme.moneyFormat
      ),
      available: product.available,
      isOnSale: isOnSale(product),
      isPriceVaries: isPriceVaries(product),
      isCompareVaries: isCompareVaries(product)
    };
  }

  function getProductImage(product) {
    var image;
    var featuredImage;

    if (product.variants.length > 0 && product.variants[0].image !== null) {
      featuredImage = product.variants[0].featured_image;
    } else if (product.image) {
      featuredImage = product.featured_image;
    } else {
      image = null;
    }

    if (image !== null) {
      image = {
        url: theme.Images.getSizedImageUrl(featuredImage.url, '100x'),
        alt: featuredImage.alt
      };
    }

    return image;
  }

  function isOnSale(product) {
    return (
      product.compare_at_price_min !== null &&
      parseInt(product.compare_at_price_min, 10) >
        parseInt(product.price_min, 10)
    );
  }

  function isPriceVaries(product) {
    return product.price_max !== product.price_min;
  }

  function isCompareVaries(product) {
    return product.compare_at_price_max !== product.compare_at_price_min;
  }

  // Returns the number of optional product details to be shown,
  // values of the detailsList need to be boolean.
  function getDetailsCount() {
    var detailsList = [
      theme.settings.predictiveSearchShowPrice,
      theme.settings.predictiveSearchShowVendor
    ];

    var detailsCount = detailsList.reduce(function(acc, detail) {
      return acc + (detail ? 1 : 0);
    }, 0);

    return detailsCount;
  }

  function getNumberOfResultsString(resultNumber, resultsCount) {
    return theme.strings.number_of_results
      .replace('[result_number]', resultNumber)
      .replace('[results_count]', resultsCount);
  }

  function _htmlEscape(input) {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  return function(data) {
    var products = data.products || [];
    var isLoading = data.isLoading;
    var searchQuery = data.searchQuery || '';

    if (isLoading && products.length === 0) {
      return loadingState();
    }

    return renderResults(products, isLoading, searchQuery);
  };
})();

window.theme = window.theme || {};

(function() {
  // (a11y) This function will be used by the Predictive Search Component
  // to announce the number of search results
  function numberOfResultsTemplateFct(data) {
    if (data.products.length === 1) {
      return theme.strings.one_result_found;
    } else {
      return theme.strings.number_of_results_found.replace(
        '[results_count]',
        data.products.length
      );
    }
  }

  // (a11y) This function will be used by the Predictive Search Component
  // to announce that it's loading results
  function loadingResultsMessageTemplateFct() {
    return theme.strings.loading;
  }

  function isPredictiveSearchSupported() {
    var shopifyFeatures = JSON.parse($('#shopify-features').text());

    return shopifyFeatures.predictiveSearch;
  }

  function isPredictiveSearchEnabled() {
    return window.theme.settings.predictiveSearchEnabled;
  }

  function canInitializePredictiveSearch() {
    return isPredictiveSearchSupported() && isPredictiveSearchEnabled();
  }

  // listen for search submits and validate query
  function validateSearchHandler(searchEl, submitEl) {
    submitEl.addEventListener(
      'click',
      validateSearchInput.bind(this, searchEl)
    );
  }

  // if there is nothing in the search field, prevent submit
  function validateSearchInput(searchEl, evt) {
    var isInputValueEmpty = searchEl.value.trim().length === 0;
    if (!isInputValueEmpty) {
      return;
    }

    if (typeof evt !== 'undefined') {
      evt.preventDefault();
    }

    searchEl.focus();
  }

  window.theme.SearchPage = (function() {
    var selectors = {
      searchReset: '[data-search-page-predictive-search-clear]',
      searchInput: '[data-search-page-predictive-search-input]',
      searchSubmit: '[data-search-page-predictive-search-submit]',
      searchResults: '[data-predictive-search-mount="default"]'
    };

    var componentInstance;
    var searchInput = document.querySelector(selectors.searchInput);
    var searchSubmit = document.querySelector(selectors.searchSubmit);

    function init(config) {
      componentInstance = new window.Shopify.theme.PredictiveSearchComponent({
        selectors: {
          input: selectors.searchInput,
          reset: selectors.searchReset,
          result: selectors.searchResults
        },
        resultTemplateFct: window.theme.SearchResultsTemplate,
        numberOfResultsTemplateFct: numberOfResultsTemplateFct,
        loadingResultsMessageTemplateFct: loadingResultsMessageTemplateFct,
        onOpen: function(nodes) {
          if (config.isTabletAndUp) {
            return;
          }

          var searchInputBoundingRect = $(
            selectors.searchInput
          )[0].getBoundingClientRect();
          var bodyHeight = $('body').height();
          var offset = 50;
          var resultsMaxHeight =
            bodyHeight - searchInputBoundingRect.bottom - offset;
          $(nodes.result).css({
            maxHeight: resultsMaxHeight
          });
        },
        onBeforeDestroy: function(nodes) {
          // If the viewport width changes from mobile to tablet
          // reset the top position of the results
          $(nodes.result).css({
            maxHeight: ''
          });
        }
      });

      validateSearchHandler(searchInput, searchSubmit);
    }

    function unload() {
      if (!componentInstance) {
        return;
      }
      componentInstance.destroy();
      componentInstance = null;
    }

    return {
      init: init,
      unload: unload
    };
  })();

  window.theme.SearchHeader = (function() {
    var selectors = {
      searchInput: '[data-predictive-search-drawer-input]',
      searchResults: '[data-predictive-search-mount="drawer"]',
      searchFormContainer: '[data-search-form-container]',
      searchSubmit: '[data-search-form-submit]'
    };

    var componentInstance;
    var searchInput = document.querySelector(selectors.searchInput);
    var searchSubmit = document.querySelector(selectors.searchSubmit);

    function init(config) {
      componentInstance = new window.Shopify.theme.PredictiveSearchComponent({
        selectors: {
          input: selectors.searchInput,
          result: selectors.searchResults
        },
        resultTemplateFct: window.theme.SearchResultsTemplate,
        numberOfResultsTemplateFct: numberOfResultsTemplateFct,
        numberOfResults: config.numberOfResults,
        loadingResultsMessageTemplateFct: loadingResultsMessageTemplateFct,
        onInputBlur: function() {
          return false;
        },
        onOpen: function(nodes) {
          var searchInputBoundingRect = $(
            searchInput
          )[0].getBoundingClientRect();

          // For tablet screens and up, stop the scroll area from extending past
          // the bottom of the screen because we're locking the body scroll
          var maxHeight =
            window.innerHeight -
            searchInputBoundingRect.bottom -
            (config.isTabletAndUp ? 20 : 0);

          $(nodes.result).css({
            top: config.isTabletAndUp ? '' : searchInputBoundingRect.bottom,
            maxHeight: maxHeight
          });
        },
        onClose: function(nodes) {
          $(nodes.result).css({
            maxHeight: ''
          });
        },
        onBeforeDestroy: function(nodes) {
          // If the viewport width changes from mobile to tablet
          // reset the top position of the results
          $(nodes.result).css({
            top: ''
          });
        }
      });

      validateSearchHandler(searchInput, searchSubmit);
    }

    function unload() {
      if (!componentInstance) {
        return;
      }

      componentInstance.destroy();
      componentInstance = null;
    }

    function clearAndClose() {
      if (!componentInstance) {
        return;
      }

      componentInstance.clearAndClose();
    }

    return {
      init: init,
      unload: unload,
      clearAndClose: clearAndClose
    };
  })();

  window.theme.Search = (function() {
    var classes = {
      searchTemplate: 'template-search'
    };
    var selectors = {
      siteHeader: '.site-header'
    };
    var mediaQueryList = {
      mobile: window.matchMedia('(max-width: 749px)'),
      tabletAndUp: window.matchMedia('(min-width: 750px)')
    };

    function init() {
      if (!$(selectors.siteHeader).length) {
        return;
      }

      if (!canInitializePredictiveSearch()) {
        return;
      }

      Object.keys(mediaQueryList).forEach(function(device) {
        mediaQueryList[device].addListener(initSearchAccordingToViewport);
      });

      initSearchAccordingToViewport();
    }

    function initSearchAccordingToViewport() {
      theme.SearchDrawer.close();
      theme.SearchHeader.unload();
      theme.SearchPage.unload();

      if (mediaQueryList.mobile.matches) {
        theme.SearchHeader.init({
          numberOfResults: 4,
          isTabletAndUp: false
        });

        if (isSearchPage()) {
          theme.SearchPage.init({ isTabletAndUp: false });
        }
      } else {
        // Tablet and up
        theme.SearchHeader.init({
          numberOfResults: 4,
          isTabletAndUp: true
        });

        if (isSearchPage()) {
          theme.SearchPage.init({ isTabletAndUp: true });
        }
      }
    }

    function isSearchPage() {
      return $('body').hasClass(classes.searchTemplate);
    }

    function unload() {
      theme.SearchHeader.unload();
      theme.SearchPage.unload();
    }

    return {
      init: init,
      unload: unload
    };
  })();
})();

window.theme = window.theme || {};

theme.SearchDrawer = (function() {
  var selectors = {
    headerSection: '[data-header-section]',
    drawer: '[data-predictive-search-drawer]',
    drawerOpenButton: '[data-predictive-search-open-drawer]',
    headerSearchInput: '[data-predictive-search-drawer-input]',
    predictiveSearchWrapper: '[data-predictive-search-mount="drawer"]'
  };

  var drawerInstance;

  function init() {
    setAccessibilityProps();

    drawerInstance = new theme.Drawers('SearchDrawer', 'top', {
      onDrawerOpen: function() {
        setHeight();
        theme.MobileNav.closeMobileNav();
        lockBodyScroll();
      },
      onDrawerClose: function() {
        theme.SearchHeader.clearAndClose();
        $(selectors.drawerOpenButton).focus();
        unlockBodyScroll();
      },
      withPredictiveSearch: true,
      $elementToFocusOnOpen: $(selectors.headerSearchInput)
    });
  }

  function setAccessibilityProps() {
    $(selectors.drawerOpenButton)
      .attr('aria-controls', 'SearchDrawer')
      .attr('aria-expanded', 'false')
      .attr('aria-haspopup', 'dialog');
  }

  function setHeight() {
    $(selectors.drawer).css({
      height: $(selectors.headerSection).outerHeight()
    });
  }

  function close() {
    drawerInstance.close();
  }

  function lockBodyScroll() {
    // Disable scroll except on the predictive search container.
    window.bodyScrollLock.disableBodyScroll(
      document.querySelector(selectors.predictiveSearchWrapper),
      {
        allowTouchMove: function(element) {
          return (
            // If the touch event is in an element under the predictive search
            // we allow don't prevent default.
            $(element).parents(selectors.predictiveSearchWrapper).length === 1
          );
        }
      }
    );
  }

  function unlockBodyScroll() {
    window.bodyScrollLock.clearAllBodyScrollLocks();
  }

  return {
    init: init,
    close: close
  };
})();

theme.Disclosure = (function() {
  var selectors = {
    disclosureList: '[data-disclosure-list]',
    disclosureToggle: '[data-disclosure-toggle]',
    disclosureInput: '[data-disclosure-input]',
    disclosureOptions: '[data-disclosure-option]'
  };

  var classes = {
    listVisible: 'disclosure-list--visible'
  };

  function Disclosure($disclosure) {
    this.$container = $disclosure;
    this.cache = {};
    this._cacheSelectors();
    this._connectOptions();
    this._connectToggle();
    this._onFocusOut();
  }

  Disclosure.prototype = _.assignIn({}, Disclosure.prototype, {
    _cacheSelectors: function() {
      this.cache = {
        $disclosureList: this.$container.find(selectors.disclosureList),
        $disclosureToggle: this.$container.find(selectors.disclosureToggle),
        $disclosureInput: this.$container.find(selectors.disclosureInput),
        $disclosureOptions: this.$container.find(selectors.disclosureOptions)
      };
    },

    _connectToggle: function() {
      this.cache.$disclosureToggle.on(
        'click',
        function(evt) {
          var ariaExpanded =
            $(evt.currentTarget).attr('aria-expanded') === 'true';
          $(evt.currentTarget).attr('aria-expanded', !ariaExpanded);

          this.cache.$disclosureList.toggleClass(classes.listVisible);
        }.bind(this)
      );
    },

    _connectOptions: function() {
      this.cache.$disclosureOptions.on(
        'click',
        function(evt) {
          this._submitForm($(evt.currentTarget).data('value'));
        }.bind(this)
      );
    },

    _onFocusOut: function() {
      this.cache.$disclosureToggle.on(
        'focusout',
        function(evt) {
          var disclosureLostFocus =
            this.$container.has(evt.relatedTarget).length === 0;

          if (disclosureLostFocus) {
            this._hideList();
          }
        }.bind(this)
      );

      this.cache.$disclosureList.on(
        'focusout',
        function(evt) {
          var childInFocus =
            $(evt.currentTarget).has(evt.relatedTarget).length > 0;
          var isVisible = this.cache.$disclosureList.hasClass(
            classes.listVisible
          );

          if (isVisible && !childInFocus) {
            this._hideList();
          }
        }.bind(this)
      );

      this.$container.on(
        'keyup',
        function(evt) {
          if (evt.which !== slate.utils.keyboardKeys.ESCAPE) return;
          this._hideList();
          this.cache.$disclosureToggle.focus();
        }.bind(this)
      );

      $('body').on(
        'click',
        function(evt) {
          var isOption = this.$container.has(evt.target).length > 0;
          var isVisible = this.cache.$disclosureList.hasClass(
            classes.listVisible
          );

          if (isVisible && !isOption) {
            this._hideList();
          }
        }.bind(this)
      );
    },

    _submitForm: function(value) {
      this.cache.$disclosureInput.val(value);
      this.$container.parents('form').submit();
    },

    _hideList: function() {
      this.cache.$disclosureList.removeClass(classes.listVisible);
      this.cache.$disclosureToggle.attr('aria-expanded', false);
    },

    unload: function() {
      this.cache.$disclosureOptions.off();
      this.cache.$disclosureToggle.off();
      this.cache.$disclosureList.off();
      this.$container.off();
    }
  });

  return Disclosure;
})();


/* ================ TEMPLATES ================ */
(function() {
  var $filterBy = $('#BlogTagFilter');

  if (!$filterBy.length) {
    return;
  }

  slate.utils.resizeSelects($filterBy);

  $filterBy.on('change', function() {
    location.href = $(this).val();
  });
})();

window.theme = theme || {};

theme.customerTemplates = (function() {
  var selectors = {
    RecoverHeading: '#RecoverHeading',
    RecoverEmail: '#RecoverEmail',
    LoginHeading: '#LoginHeading'
  };

  function initEventListeners() {
    this.$RecoverHeading = $(selectors.RecoverHeading);
    this.$RecoverEmail = $(selectors.RecoverEmail);
    this.$LoginHeading = $(selectors.LoginHeading);

    // Show reset password form
    $('#RecoverPassword').on(
      'click',
      function(evt) {
        evt.preventDefault();
        showRecoverPasswordForm();
        this.$RecoverHeading.attr('tabindex', '-1').focus();
      }.bind(this)
    );

    // Hide reset password form
    $('#HideRecoverPasswordLink').on(
      'click',
      function(evt) {
        evt.preventDefault();
        hideRecoverPasswordForm();
        this.$LoginHeading.attr('tabindex', '-1').focus();
      }.bind(this)
    );

    this.$RecoverHeading.on('blur', function() {
      $(this).removeAttr('tabindex');
    });

    this.$LoginHeading.on('blur', function() {
      $(this).removeAttr('tabindex');
    });
  }

  /**
   *
   *  Show/Hide recover password form
   *
   */

  function showRecoverPasswordForm() {
    $('#RecoverPasswordForm').removeClass('hide');
    $('#CustomerLoginForm').addClass('hide');

    if (this.$RecoverEmail.attr('aria-invalid') === 'true') {
      this.$RecoverEmail.focus();
    }
  }

  function hideRecoverPasswordForm() {
    $('#RecoverPasswordForm').addClass('hide');
    $('#CustomerLoginForm').removeClass('hide');
  }

  /**
   *
   *  Show reset password success message
   *
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess')
      .removeClass('hide')
      .focus();
  }

  /**
   *
   *  Show/hide customer address forms
   *
   */
  function customerAddressForm() {
    var $newAddressForm = $('#AddressNewForm');
    var $newAddressFormButton = $('#AddressNewButton');

    if (!$newAddressForm.length) {
      return;
    }

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(
        'AddressCountryNew',
        'AddressProvinceNew',
        {
          hideElement: 'AddressProvinceContainerNew'
        }
      );
    }

    // Initialize each edit form's country/province selector
    $('.address-country-option').each(function() {
      var formId = $(this).data('form-id');
      var countrySelector = 'AddressCountry_' + formId;
      var provinceSelector = 'AddressProvince_' + formId;
      var containerSelector = 'AddressProvinceContainer_' + formId;

      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });

    // Toggle new/edit address forms
    $('.address-new-toggle').on('click', function() {
      var isExpanded = $newAddressFormButton.attr('aria-expanded') === 'true';

      $newAddressForm.toggleClass('hide');
      $newAddressFormButton.attr('aria-expanded', !isExpanded).focus();
    });

    $('.address-edit-toggle').on('click', function() {
      var formId = $(this).data('form-id');
      var $editButton = $('#EditFormButton_' + formId);
      var $editAddress = $('#EditAddress_' + formId);
      var isExpanded = $editButton.attr('aria-expanded') === 'true';

      $editAddress.toggleClass('hide');
      $editButton.attr('aria-expanded', !isExpanded).focus();
    });

    $('.address-delete').on('click', function() {
      var $el = $(this);
      var target = $el.data('target');
      var confirmMessage = $el.data('confirm-message');

      // eslint-disable-next-line no-alert
      if (
        confirm(
          confirmMessage || 'Are you sure you wish to delete this address?'
        )
      ) {
        Shopify.postLink(target, {
          parameters: { _method: 'delete' }
        });
      }
    });
  }

  /**
   *
   *  Check URL for reset password hash
   *
   */
  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      showRecoverPasswordForm.bind(this)();
    }
  }

  return {
    init: function() {
      initEventListeners();
      checkUrlHash();
      resetPasswordSuccess();
      customerAddressForm();
    }
  };
})();


/*================ SECTIONS ================*/
window.theme = window.theme || {};

theme.Cart = (function() {
  var selectors = {
    cartCount: '[data-cart-count]',
    cartCountBubble: '[data-cart-count-bubble]',
    cartDiscount: '[data-cart-discount]',
    cartDiscountTitle: '[data-cart-discount-title]',
    cartDiscountAmount: '[data-cart-discount-amount]',
    cartDiscountWrapper: '[data-cart-discount-wrapper]',
    cartErrorMessage: '[data-cart-error-message]',
    cartErrorMessageWrapper: '[data-cart-error-message-wrapper]',
    cartItem: '[data-cart-item]',
    cartItemDetails: '[data-cart-item-details]',
    cartItemDiscount: '[data-cart-item-discount]',
    cartItemDiscountedPriceGroup: '[data-cart-item-discounted-price-group]',
    cartItemDiscountTitle: '[data-cart-item-discount-title]',
    cartItemDiscountAmount: '[data-cart-item-discount-amount]',
    cartItemDiscountList: '[data-cart-item-discount-list]',
    cartItemFinalPrice: '[data-cart-item-final-price]',
    cartItemImage: '[data-cart-item-image]',
    cartItemLinePrice: '[data-cart-item-line-price]',
    cartItemOriginalPrice: '[data-cart-item-original-price]',
    cartItemPrice: '[data-cart-item-price]',
    cartItemPriceList: '[data-cart-item-price-list]',
    cartItemProperty: '[data-cart-item-property]',
    cartItemPropertyName: '[data-cart-item-property-name]',
    cartItemPropertyValue: '[data-cart-item-property-value]',
    cartItemRegularPriceGroup: '[data-cart-item-regular-price-group]',
    cartItemRegularPrice: '[data-cart-item-regular-price]',
    cartItemTitle: '[data-cart-item-title]',
    cartItemOption: '[data-cart-item-option]',
    cartLineItems: '[data-cart-line-items]',
    cartNote: '[data-cart-notes]',
    cartQuantityErrorMessage: '[data-cart-quantity-error-message]',
    cartQuantityErrorMessageWrapper:
      '[data-cart-quantity-error-message-wrapper]',
    cartRemove: '[data-cart-remove]',
    cartStatus: '[data-cart-status]',
    cartSubtotal: '[data-cart-subtotal]',
    cartTableCell: '[data-cart-table-cell]',
    cartWrapper: '[data-cart-wrapper]',
    emptyPageContent: '[data-empty-page-content]',
    quantityInput: '[data-quantity-input]',
    quantityInputMobile: '[data-quantity-input-mobile]',
    quantityInputDesktop: '[data-quantity-input-desktop]',
    quantityLabelMobile: '[data-quantity-label-mobile]',
    quantityLabelDesktop: '[data-quantity-label-desktop]',
    inputQty: '[data-quantity-input]',
    thumbnails: '.cart__image',
    unitPrice: '[data-unit-price]',
    unitPriceBaseUnit: '[data-unit-price-base-unit]',
    unitPriceGroup: '[data-unit-price-group]'
  };

  var classes = {
    cartNoCookies: 'cart--no-cookies',
    cartRemovedProduct: 'cart__removed-product',
    hide: 'hide',
    inputError: 'input--error'
  };

  var attributes = {
    cartItemIndex: 'data-cart-item-index',
    cartItemKey: 'data-cart-item-key',
    cartItemQuantity: 'data-cart-item-quantity',
    cartItemTitle: 'data-cart-item-title',
    cartItemUrl: 'data-cart-item-url',
    quantityItem: 'data-quantity-item'
  };

  theme.breakpoints = theme.breakpoints || {};

  if (
    isNaN(theme.breakpoints.medium) ||
    theme.breakpoints.medium === undefined
  ) {
    theme.breakpoints.medium = 750;
  }

  var mediumUpQuery = '(min-width: ' + theme.breakpoints.medium + 'px)';

  function Cart(container) {
    this.$container = $(container);
    this.$thumbnails = $(selectors.thumbnails, this.$container);
    this.ajaxEnabled = this.$container.data('ajax-enabled');

    if (!this.cookiesEnabled()) {
      this.$container.addClass(classes.cartNoCookies);
    }

    this.$thumbnails.css('cursor', 'pointer');
    this.$container.on(
      'click',
      selectors.thumbnails,
      this._handleThumbnailClick
    );

    this.$container.on(
      'change',
      selectors.inputQty,
      $.debounce(500, this._handleInputQty.bind(this))
    );

    this.mql = window.matchMedia(mediumUpQuery);
    this.mql.addListener(this.setQuantityFormControllers.bind(this));
    this.setQuantityFormControllers();

    if (this.ajaxEnabled) {
      /**
       * Because the entire cart is recreated when a cart item is updated,
       * we cannot cache the elements in the cart. Instead, we add the event
       * listeners on the cart's container to allow us to retain the event
       * listeners after rebuilding the cart when an item is updated.
       */

      this.$container.on(
        'change',
        selectors.cartNote,
        this._onNoteChange.bind(this)
      );

      this.$container.on(
        'click',
        selectors.cartRemove,
        this._onRemoveItem.bind(this)
      );

      this._setupCartTemplates();
    }
  }

  Cart.prototype = _.assignIn({}, Cart.prototype, {
    _setupCartTemplates: function() {
      this.$itemTemplate = $(selectors.cartItem, this.$container)
        .first()
        .clone();
      this.$itemDiscountTemplate = $(
        selectors.cartItemDiscount,
        this.$itemTemplate
      ).clone();
      this.$itemOptionTemplate = $(
        selectors.cartItemOption,
        this.$itemTemplate
      ).clone();
      this.$itemPropertyTemplate = $(
        selectors.cartItemProperty,
        this.$itemTemplate
      ).clone();
      this.$itemPriceListTemplate = $(
        selectors.cartItemPriceList,
        this.$itemTemplate
      ).clone();
      this.$itemLinePriceTemplate = $(
        selectors.cartItemLinePrice,
        this.$itemTemplate
      ).clone();
      this.$cartDiscountTemplate = $(
        selectors.cartDiscount,
        this.$container
      ).clone();
    },

    _handleInputQty: function(evt) {
      var $input = $(evt.target);
      var itemIndex = $input.data('quantity-item');
      var $itemElement = $input.closest(selectors.cartItem);
      var $itemQtyInputs = $('[data-quantity-item=' + itemIndex + ']');
      var value = parseInt($input.val());
      var isValidValue = !(value < 0 || isNaN(value));
      $itemQtyInputs.val(value);

      this._hideCartError();
      this._hideQuantityErrorMessage();

      if (!isValidValue) {
        this._showQuantityErrorMessages($itemElement);
        return;
      }

      if (isValidValue && this.ajaxEnabled) {
        this._updateItemQuantity(
          itemIndex,
          $itemElement,
          $itemQtyInputs,
          value
        );
      }
    },

    _updateItemQuantity: function(
      itemIndex,
      $itemElement,
      $itemQtyInputs,
      value
    ) {
      var key = $itemElement.attr(attributes.cartItemKey);
      var index = $itemElement.attr(attributes.cartItemIndex);

      var params = {
        url: '/cart/change.js',
        data: { quantity: value, line: index },
        dataType: 'json'
      };

      $.post(params)
        .done(
          function(state) {
            if (state.item_count === 0) {
              this._emptyCart();
            } else {
              this._createCart(state);

              if (value === 0) {
                this._showRemoveMessage($itemElement.clone());
              } else {
                var $lineItem = $('[data-cart-item-key="' + key + '"]');
                var item = this.getItem(key, state);

                $(selectors.quantityInput, $lineItem).focus();
                this._updateLiveRegion(item);
              }
            }

            this._setCartCountBubble(state.item_count);
          }.bind(this)
        )
        .fail(
          function() {
            this._showCartError($itemQtyInputs);
          }.bind(this)
        );
    },

    getItem: function(key, state) {
      return state.items.find(function(item) {
        return item.key === key;
      });
    },

    _liveRegionText: function(item) {
      // Dummy content for live region
      var liveRegionText =
        theme.strings.update +
        ': [QuantityLabel]: [Quantity], [Regular] [$$] [DiscountedPrice] [$]. [PriceInformation]';

      // Update Quantity
      liveRegionText = liveRegionText
        .replace('[QuantityLabel]', theme.strings.quantity)
        .replace('[Quantity]', item.quantity);

      // Update pricing information
      var regularLabel = '';
      var regularPrice = theme.Currency.formatMoney(
        item.original_line_price,
        theme.moneyFormat
      );
      var discountLabel = '';
      var discountPrice = '';
      var discountInformation = '';

      if (item.original_line_price > item.final_line_price) {
        regularLabel = theme.strings.regularTotal;

        discountLabel = theme.strings.discountedTotal;
        discountPrice = theme.Currency.formatMoney(
          item.final_line_price,
          theme.moneyFormat
        );

        discountInformation = theme.strings.priceColumn;
      }

      liveRegionText = liveRegionText
        .replace('[Regular]', regularLabel)
        .replace('[$$]', regularPrice)
        .replace('[DiscountedPrice]', discountLabel)
        .replace('[$]', discountPrice)
        .replace('[PriceInformation]', discountInformation)
        .trim();

      return liveRegionText;
    },

    _updateLiveRegion: function(item) {
      var $liveRegion = $(selectors.cartStatus);
      $liveRegion.html(this._liveRegionText(item)).attr('aria-hidden', false);

      // hide content from accessibility tree after announcement
      setTimeout(function() {
        $liveRegion.attr('aria-hidden', true);
      }, 1000);
    },

    _createCart: function(state) {
      var cartDiscountList = this._createCartDiscountList(state);

      $(selectors.cartLineItems, this.$container).html(
        this._createLineItemList(state)
      );

      this.setQuantityFormControllers();

      $(selectors.cartNote, this.$container).val(state.note);

      if (cartDiscountList.length === 0) {
        $(selectors.cartDiscountWrapper, this.$container)
          .html('')
          .addClass(classes.hide);
      } else {
        $(selectors.cartDiscountWrapper, this.$container)
          .html(cartDiscountList)
          .removeClass(classes.hide);
      }

      $(selectors.cartSubtotal, this.$container).html(
        theme.Currency.formatMoney(
          state.total_price,
          theme.moneyFormatWithCurrency
        )
      );
    },

    _createCartDiscountList: function(cart) {
      return $.map(
        cart.cart_level_discount_applications,
        function(discount) {
          var $discount = this.$cartDiscountTemplate.clone();
          $discount.find(selectors.cartDiscountTitle).text(discount.title);
          $discount
            .find(selectors.cartDiscountAmount)
            .html(
              theme.Currency.formatMoney(
                discount.total_allocated_amount,
                theme.moneyFormat
              )
            );
          return $discount[0];
        }.bind(this)
      );
    },

    _createLineItemList: function(state) {
      return $.map(
        state.items,
        function(item, index) {
          var $item = this.$itemTemplate.clone();
          var $itemPriceList = this.$itemPriceListTemplate.clone();

          this._setLineItemAttributes($item, item, index);
          this._setLineItemImage($item, item.featured_image);

          $(selectors.cartItemTitle, $item)
            .text(item.product_title)
            .attr('href', item.url);

          var productDetailsList = this._createProductDetailsList(
            item.product_has_only_default_variant,
            item.options_with_values,
            item.properties
          );
          this._setProductDetailsList($item, productDetailsList);

          this._setItemRemove($item, item.title);

          $itemPriceList.html(
            this._createItemPrice(
              item.original_price,
              item.final_price,
              this.$itemPriceListTemplate
            )
          );

          if (item.unit_price_measurement) {
            $itemPriceList.append(
              this._createUnitPrice(
                item.unit_price,
                item.unit_price_measurement,
                this.$itemPriceListTemplate
              )
            );
          }

          this._setItemPrice($item, $itemPriceList);

          var itemDiscountList = this._createItemDiscountList(item);
          this._setItemDiscountList($item, itemDiscountList);

          this._setQuantityInputs($item, item, index);

          var itemLinePrice = this._createItemPrice(
            item.original_line_price,
            item.final_line_price,
            this.$itemLinePriceTemplate
          );
          this._setItemLinePrice($item, itemLinePrice);

          return $item[0];
        }.bind(this)
      );
    },

    _setLineItemAttributes: function($item, item, index) {
      $item
        .attr(attributes.cartItemKey, item.key)
        .attr(attributes.cartItemUrl, item.url)
        .attr(attributes.cartItemTitle, item.title)
        .attr(attributes.cartItemIndex, index + 1)
        .attr(attributes.cartItemQuantity, item.quantity);
    },

    _setLineItemImage: function($item, featuredImage) {
      var $image = $(selectors.cartItemImage, $item);

      var sizedImageUrl =
        featuredImage.url !== null
          ? theme.Images.getSizedImageUrl(featuredImage.url, 'x190')
          : null;

      if (sizedImageUrl) {
        $image
          .attr('alt', featuredImage.alt)
          .attr('src', sizedImageUrl)
          .removeClass(classes.hide);
      } else {
        $image.remove();
      }
    },

    _setProductDetailsList: function($item, productDetailsList) {
      var $itemDetails = $(selectors.cartItemDetails, $item);

      if (productDetailsList.length === 0) {
        $itemDetails.addClass(classes.hide).text('');
      } else {
        $itemDetails.removeClass(classes.hide).html(productDetailsList);
      }
    },

    _setItemPrice: function($item, price) {
      $(selectors.cartItemPrice, $item).html(price);
    },

    _setItemDiscountList: function($item, discountList) {
      var $itemDiscountList = $(selectors.cartItemDiscountList, $item);

      if (discountList.length === 0) {
        $itemDiscountList.html('').addClass(classes.hide);
      } else {
        $itemDiscountList.html(discountList).removeClass(classes.hide);
      }
    },

    _setItemRemove: function($item, title) {
      $(selectors.cartRemove, $item).attr(
        'aria-label',
        theme.strings.removeLabel.replace('[product]', title)
      );
    },

    _setQuantityInputs: function($item, item, index) {
      $(selectors.quantityInputMobile, $item)
        .attr('id', 'updates_' + item.key)
        .attr(attributes.quantityItem, index + 1)
        .val(item.quantity);

      $(selectors.quantityInputDesktop, $item)
        .attr('id', 'updates_large_' + item.key)
        .attr(attributes.quantityItem, index + 1)
        .val(item.quantity);

      $(selectors.quantityLabelMobile, $item).attr(
        'for',
        'updates_' + item.key
      );

      $(selectors.quantityLabelDesktop, $item).attr(
        'for',
        'updates_large_' + item.key
      );
    },

    setQuantityFormControllers: function() {
      if (this.mql.matches) {
        $(selectors.quantityInputDesktop).attr('name', 'updates[]');
        $(selectors.quantityInputMobile).removeAttr('name');
      } else {
        $(selectors.quantityInputMobile).attr('name', 'updates[]');
        $(selectors.quantityInputDesktop).removeAttr('name');
      }
    },

    _setItemLinePrice: function($item, price) {
      $(selectors.cartItemLinePrice, $item).html(price);
    },

    _createProductDetailsList: function(
      product_has_only_default_variant,
      options,
      properties
    ) {
      var optionsPropertiesHTML = [];

      if (!product_has_only_default_variant) {
        optionsPropertiesHTML = optionsPropertiesHTML.concat(
          this._getOptionList(options)
        );
      }

      if (properties !== null && Object.keys(properties).length !== 0) {
        optionsPropertiesHTML = optionsPropertiesHTML.concat(
          this._getPropertyList(properties)
        );
      }

      return optionsPropertiesHTML;
    },

    _getOptionList: function(options) {
      return $.map(
        options,
        function(option) {
          var $optionElement = this.$itemOptionTemplate.clone();

          $optionElement
            .text(option.name + ': ' + option.value)
            .removeClass(classes.hide);

          return $optionElement[0];
        }.bind(this)
      );
    },

    _getPropertyList: function(properties) {
      var propertiesArray =
        properties !== null ? Object.entries(properties) : [];

      return $.map(
        propertiesArray,
        function(property) {
          var $propertyElement = this.$itemPropertyTemplate.clone();

          // Line item properties prefixed with an underscore are not to be displayed
          if (property[0].charAt(0) === '_') return;

          // if the property value has a length of 0 (empty), don't display it
          if (property[1].length === 0) return;

          $propertyElement
            .find(selectors.cartItemPropertyName)
            .text(property[0]);

          if (property[0].indexOf('/uploads/') === -1) {
            $propertyElement
              .find(selectors.cartItemPropertyValue)
              .text(': ' + property[1]);
          } else {
            $propertyElement
              .find(selectors.cartItemPropertyValue)
              .html(
                ': <a href="' +
                  property[1] +
                  '"> ' +
                  property[1].split('/').pop() +
                  '</a>'
              );
          }

          $propertyElement.removeClass(classes.hide);

          return $propertyElement[0];
        }.bind(this)
      );
    },

    _createItemPrice: function(original_price, final_price, $priceTemplate) {
      if (original_price !== final_price) {
        var $discountedPrice = $(
          selectors.cartItemDiscountedPriceGroup,
          $priceTemplate
        ).clone();

        $(selectors.cartItemOriginalPrice, $discountedPrice).html(
          theme.Currency.formatMoney(original_price, theme.moneyFormat)
        );
        $(selectors.cartItemFinalPrice, $discountedPrice).html(
          theme.Currency.formatMoney(final_price, theme.moneyFormat)
        );
        $discountedPrice.removeClass(classes.hide);

        return $discountedPrice[0];
      } else {
        var $regularPrice = $(
          selectors.cartItemRegularPriceGroup,
          $priceTemplate
        ).clone();

        $(selectors.cartItemRegularPrice, $regularPrice).html(
          theme.Currency.formatMoney(original_price, theme.moneyFormat)
        );

        $regularPrice.removeClass(classes.hide);

        return $regularPrice[0];
      }
    },

    _createUnitPrice: function(
      unitPrice,
      unitPriceMeasurement,
      $itemPriceGroup
    ) {
      var $unitPriceGroup = $(
        selectors.unitPriceGroup,
        $itemPriceGroup
      ).clone();

      var unitPriceBaseUnit =
        (unitPriceMeasurement.reference_value !== 1
          ? unitPriceMeasurement.reference_value
          : '') + unitPriceMeasurement.reference_unit;

      $(selectors.unitPriceBaseUnit, $unitPriceGroup).text(unitPriceBaseUnit);
      $(selectors.unitPrice, $unitPriceGroup).html(
        theme.Currency.formatMoney(unitPrice, theme.moneyFormat)
      );

      $unitPriceGroup.removeClass(classes.hide);

      return $unitPriceGroup[0];
    },

    _createItemDiscountList: function(item) {
      return $.map(
        item.line_level_discount_allocations,
        function(discount) {
          var $discount = this.$itemDiscountTemplate.clone();
          $discount
            .find(selectors.cartItemDiscountTitle)
            .text(discount.discount_application.title);
          $discount
            .find(selectors.cartItemDiscountAmount)
            .html(
              theme.Currency.formatMoney(discount.amount, theme.moneyFormat)
            );
          return $discount[0];
        }.bind(this)
      );
    },

    _showQuantityErrorMessages: function(itemElement) {
      $(selectors.cartQuantityErrorMessage, itemElement).text(
        theme.strings.quantityMinimumMessage
      );

      $(selectors.cartQuantityErrorMessageWrapper, itemElement).removeClass(
        classes.hide
      );

      $(selectors.inputQty, itemElement)
        .addClass(classes.inputError)
        .focus();
    },

    _hideQuantityErrorMessage: function() {
      var $errorMessages = $(
        selectors.cartQuantityErrorMessageWrapper
      ).addClass(classes.hide);

      $(selectors.cartQuantityErrorMessage, $errorMessages).text('');

      $(selectors.inputQty, this.$container).removeClass(classes.inputError);
    },

    _handleThumbnailClick: function(evt) {
      var url = $(evt.target)
        .closest(selectors.cartItem)
        .data('cart-item-url');

      window.location.href = url;
    },

    _onNoteChange: function(evt) {
      var note = evt.currentTarget.value;
      this._hideCartError();
      this._hideQuantityErrorMessage();

      var params = {
        url: '/cart/update.js',
        data: { note: note },
        dataType: 'json'
      };

      $.post(params).fail(
        function() {
          this._showCartError(evt.currentTarget);
        }.bind(this)
      );
    },

    _showCartError: function(elementToFocus) {
      $(selectors.cartErrorMessage).text(theme.strings.cartError);

      $(selectors.cartErrorMessageWrapper).removeClass(classes.hide);

      elementToFocus.focus();
    },

    _hideCartError: function() {
      $(selectors.cartErrorMessageWrapper).addClass(classes.hide);
      $(selectors.cartErrorMessage).text('');
    },

    _onRemoveItem: function(evt) {
      evt.preventDefault();
      var $remove = $(evt.target);
      var $lineItem = $remove.closest(selectors.cartItem);
      var index = $lineItem.attr(attributes.cartItemIndex);
      this._hideCartError();

      var params = {
        url: '/cart/change.js',
        data: { quantity: 0, line: index },
        dataType: 'json'
      };

      $.post(params)
        .done(
          function(state) {
            if (state.item_count === 0) {
              this._emptyCart();
            } else {
              this._createCart(state);
              this._showRemoveMessage($lineItem.clone());
            }

            this._setCartCountBubble(state.item_count);
          }.bind(this)
        )
        .fail(
          function() {
            this._showCartError(null);
          }.bind(this)
        );
    },

    _showRemoveMessage: function(lineItem) {
      var index = lineItem.data('cart-item-index');
      var removeMessage = this._getRemoveMessage(lineItem);
      var $lineItemAtIndex;

      if (index - 1 === 0) {
        $lineItemAtIndex = $('[data-cart-item-index="1"]', this.$container);
        $(removeMessage).insertBefore($lineItemAtIndex);
      } else {
        $lineItemAtIndex = $(
          '[data-cart-item-index="' + (index - 1) + '"]',
          this.$container
        );
        removeMessage.insertAfter($lineItemAtIndex);
      }
      removeMessage.focus();
    },

    _getRemoveMessage: function(lineItem) {
      var formattedMessage = this._formatRemoveMessage(lineItem);

      var $tableCell = $(selectors.cartTableCell, lineItem).clone();
      $tableCell
        .removeClass()
        .addClass(classes.cartRemovedProduct)
        .attr('colspan', '4')
        .html(formattedMessage);

      lineItem
        .attr('role', 'alert')
        .html($tableCell)
        .attr('tabindex', '-1');

      return lineItem;
    },

    _formatRemoveMessage: function(lineItem) {
      var quantity = lineItem.data('cart-item-quantity');
      var url = lineItem.attr(attributes.cartItemUrl);
      var title = lineItem.attr(attributes.cartItemTitle);

      return theme.strings.removedItemMessage
        .replace('[quantity]', quantity)
        .replace(
          '[link]',
          '<a ' +
            'href="' +
            url +
            '" class="text-link text-link--accent">' +
            title +
            '</a>'
        );
    },

    _setCartCountBubble: function(quantity) {
      this.$cartCountBubble =
        this.$cartCountBubble || $(selectors.cartCountBubble);
      this.$cartCount = this.$cartCount || $(selectors.cartCount);

      if (quantity > 0) {
        this.$cartCountBubble.removeClass(classes.hide);
        this.$cartCount.html(quantity);
      } else {
        this.$cartCountBubble.addClass(classes.hide);
        this.$cartCount.html('');
      }
    },

    _emptyCart: function() {
      this.$emptyPageContent =
        this.$emptyPageContent ||
        $(selectors.emptyPageContent, this.$container);
      this.$cartWrapper =
        this.$cartWrapper || $(selectors.cartWrapper, this.$container);

      this.$emptyPageContent.removeClass(classes.hide);
      this.$cartWrapper.addClass(classes.hide);
    },

    cookiesEnabled: function() {
      var cookieEnabled = navigator.cookieEnabled;

      if (!cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
      }
      return cookieEnabled;
    }
  });

  return Cart;
})();

window.theme = window.theme || {};

theme.Filters = (function() {
  var settings = {
    // Breakpoints from src/stylesheets/global/variables.scss.liquid
    mediaQueryMediumUp: 'screen and (min-width: 750px)'
  };

  var selectors = {
    mainContent: '#MainContent',
    filterSelection: '#FilterTags',
    sortSelection: '#SortBy'
  };

  var data = {
    sortBy: 'data-default-sortby'
  };

  function Filters(container) {
    var $container = (this.$container = $(container));

    this.$filterSelect = $(selectors.filterSelection, $container);
    this.$sortSelect = $(selectors.sortSelection, $container);
    this.$selects = $(selectors.filterSelection, $container).add(
      $(selectors.sortSelection, $container)
    );

    this.defaultSort = this._getDefaultSortValue();
    this.$selects.removeClass('hidden');

    this.$filterSelect.on('change', this._onFilterChange.bind(this));
    this.$sortSelect.on('change', this._onSortChange.bind(this));
    this._initBreakpoints();
    this._initParams();
  }

  Filters.prototype = _.assignIn({}, Filters.prototype, {
    _initBreakpoints: function() {
      var self = this;

      enquire.register(settings.mediaQueryMediumUp, {
        match: function() {
          slate.utils.resizeSelects(self.$selects);
        }
      });
    },

    _initParams: function() {
      self.queryParams = {};
      if (location.search.length) {
        var aKeyValue;
        var aCouples = location.search.substr(1).split('&');
        for (var i = 0; i < aCouples.length; i++) {
          aKeyValue = aCouples[i].split('=');
          if (aKeyValue.length > 1) {
            self.queryParams[
              decodeURIComponent(aKeyValue[0])
            ] = decodeURIComponent(aKeyValue[1]);
          }
        }
      }
    },

    _onSortChange: function() {
      self.queryParams.sort_by = this._getSortValue();

      if (self.queryParams.page) {
        delete self.queryParams.page;
      }
      window.location.search = decodeURIComponent($.param(self.queryParams));
    },

    _onFilterChange: function() {
      document.location.href = this._getFilterValue();
    },

    _getFilterValue: function() {
      return this.$filterSelect.val();
    },

    _getSortValue: function() {
      return this.$sortSelect.val() || this.defaultSort;
    },

    _getDefaultSortValue: function() {
      return this.$sortSelect.attr(data.sortBy);
    },

    onUnload: function() {
      this.$filterSelect.off('change', this._onFilterChange);
      this.$sortSelect.off('change', this._onSortChange);
    }
  });

  return Filters;
})();

window.theme = window.theme || {};

theme.HeaderSection = (function() {
  function Header() {
    theme.Header.init();
    theme.MobileNav.init();
    theme.SearchDrawer.init();
    theme.Search.init();
  }

  Header.prototype = _.assignIn({}, Header.prototype, {
    onUnload: function() {
      theme.Header.unload();
      theme.Search.unload();
    }
  });

  return Header;
})();

theme.Maps = (function() {
  var config = {
    zoom: 14
  };
  var apiStatus = null;
  var mapsToLoad = [];

  var errors = {
    addressNoResults: theme.strings.addressNoResults,
    addressQueryLimit: theme.strings.addressQueryLimit,
    addressError: theme.strings.addressError,
    authError: theme.strings.authError
  };

  var selectors = {
    section: '[data-section-type="map"]',
    map: '[data-map]',
    mapOverlay: '[data-map-overlay]'
  };

  var classes = {
    mapError: 'map-section--load-error',
    errorMsg: 'map-section__error errors text-center'
  };

  // Global function called by Google on auth errors.
  // Show an auto error message on all map instances.
  // eslint-disable-next-line camelcase, no-unused-vars
  window.gm_authFailure = function() {
    if (!Shopify.designMode) {
      return;
    }

    $(selectors.section).addClass(classes.mapError);
    $(selectors.map).remove();
    $(selectors.mapOverlay).after(
      '<div class="' +
        classes.errorMsg +
        '">' +
        theme.strings.authError +
        '</div>'
    );
  };

  function Map(container) {
    this.$container = $(container);
    this.$map = this.$container.find(selectors.map);
    this.key = this.$map.data('api-key');

    if (typeof this.key === 'undefined') {
      return;
    }

    if (apiStatus === 'loaded') {
      this.createMap();
    } else {
      mapsToLoad.push(this);

      if (apiStatus !== 'loading') {
        apiStatus = 'loading';
        if (typeof window.google === 'undefined') {
          $.getScript(
            'https://maps.googleapis.com/maps/api/js?key=' + this.key
          ).then(function() {
            apiStatus = 'loaded';
            initAllMaps();
          });
        }
      }
    }
  }

  function initAllMaps() {
    // API has loaded, load all Map instances in queue
    $.each(mapsToLoad, function(index, instance) {
      instance.createMap();
    });
  }

  function geolocate($map) {
    var deferred = $.Deferred();
    var geocoder = new google.maps.Geocoder();
    var address = $map.data('address-setting');

    geocoder.geocode({ address: address }, function(results, status) {
      if (status !== google.maps.GeocoderStatus.OK) {
        deferred.reject(status);
      }

      deferred.resolve(results);
    });

    return deferred;
  }

  Map.prototype = _.assignIn({}, Map.prototype, {
    createMap: function() {
      var $map = this.$map;

      return geolocate($map)
        .then(
          function(results) {
            var mapOptions = {
              zoom: config.zoom,
              center: results[0].geometry.location,
              draggable: false,
              clickableIcons: false,
              scrollwheel: false,
              disableDoubleClickZoom: true,
              disableDefaultUI: true
            };

            var map = (this.map = new google.maps.Map($map[0], mapOptions));
            var center = (this.center = map.getCenter());

            //eslint-disable-next-line no-unused-vars
            var marker = new google.maps.Marker({
              map: map,
              position: map.getCenter()
            });

            google.maps.event.addDomListener(
              window,
              'resize',
              $.debounce(250, function() {
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
                $map.removeAttr('style');
              })
            );
          }.bind(this)
        )
        .fail(function() {
          var errorMessage;

          switch (status) {
            case 'ZERO_RESULTS':
              errorMessage = errors.addressNoResults;
              break;
            case 'OVER_QUERY_LIMIT':
              errorMessage = errors.addressQueryLimit;
              break;
            case 'REQUEST_DENIED':
              errorMessage = errors.authError;
              break;
            default:
              errorMessage = errors.addressError;
              break;
          }

          // Show errors only to merchant in the editor.
          if (Shopify.designMode) {
            $map
              .parent()
              .addClass(classes.mapError)
              .html(
                '<div class="' +
                  classes.errorMsg +
                  '">' +
                  errorMessage +
                  '</div>'
              );
          }
        });
    },

    onUnload: function() {
      if (this.$map.length === 0) {
        return;
      }
      google.maps.event.clearListeners(this.map, 'resize');
    }
  });

  return Map;
})();

/* eslint-disable no-new */
theme.Product = (function() {
  function Product(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    this.ajaxEnabled = $container.data('ajax-enabled');

    this.settings = {
      // Breakpoints from src/stylesheets/global/variables.scss.liquid
      mediaQueryMediumUp: 'screen and (min-width: 750px)',
      mediaQuerySmall: 'screen and (max-width: 749px)',
      bpSmall: false,
      enableHistoryState: $container.data('enable-history-state') || false,
      namespace: '.slideshow-' + sectionId,
      sectionId: sectionId,
      sliderActive: false,
      zoomEnabled: false
    };

    this.selectors = {
      addToCart: '[data-add-to-cart]',
      addToCartText: '[data-add-to-cart-text]',
      cartCount: '[data-cart-count]',
      cartCountBubble: '[data-cart-count-bubble]',
      cartPopup: '[data-cart-popup]',
      cartPopupCartQuantity: '[data-cart-popup-cart-quantity]',
      cartPopupClose: '[data-cart-popup-close]',
      cartPopupDismiss: '[data-cart-popup-dismiss]',
      cartPopupImage: '[data-cart-popup-image]',
      cartPopupImageWrapper: '[data-cart-popup-image-wrapper]',
      cartPopupImagePlaceholder: '[data-cart-popup-image-placeholder]',
      cartPopupPlaceholderSize: '[data-placeholder-size]',
      cartPopupProductDetails: '[data-cart-popup-product-details]',
      cartPopupQuantity: '[data-cart-popup-quantity]',
      cartPopupQuantityLabel: '[data-cart-popup-quantity-label]',
      cartPopupTitle: '[data-cart-popup-title]',
      cartPopupWrapper: '[data-cart-popup-wrapper]',
      loader: '[data-loader]',
      loaderStatus: '[data-loader-status]',
      quantity: '[data-quantity-input]',
      SKU: '.variant-sku',
      productStatus: '[data-product-status]',
      originalSelectorId: '#ProductSelect-' + sectionId,
      productForm: '[data-product-form]',
      errorMessage: '[data-error-message]',
      errorMessageWrapper: '[data-error-message-wrapper]',
      imageZoomWrapper: '[data-image-zoom-wrapper]',
      productMediaWrapper: '[data-product-single-media-wrapper]',
      productThumbImages: '.product-single__thumbnail--' + sectionId,
      productThumbs: '.product-single__thumbnails-' + sectionId,
      productThumbListItem: '.product-single__thumbnails-item',
      productThumbsWrapper: '.thumbnails-wrapper',
      saleLabel: '.product-price__sale-label-' + sectionId,
      singleOptionSelector: '.single-option-selector-' + sectionId,
      shopifyPaymentButton: '.shopify-payment-button',
      productMediaTypeVideo: '[data-product-media-type-video]',
      productMediaTypeModel: '[data-product-media-type-model]',
      priceContainer: '[data-price]',
      regularPrice: '[data-regular-price]',
      salePrice: '[data-sale-price]',
      unitPrice: '[data-unit-price]',
      unitPriceBaseUnit: '[data-unit-price-base-unit]',
      productPolicies: '[data-product-policies]'
    };

    this.classes = {
      cartPopupWrapperHidden: 'cart-popup-wrapper--hidden',
      hidden: 'hide',
      visibilityHidden: 'visibility-hidden',
      inputError: 'input--error',
      jsZoomEnabled: 'js-zoom-enabled',
      productOnSale: 'price--on-sale',
      productUnitAvailable: 'price--unit-available',
      productUnavailable: 'price--unavailable',
      productSoldOut: 'price--sold-out',
      cartImage: 'cart-popup-item__image',
      productFormErrorMessageWrapperHidden:
        'product-form__error-message-wrapper--hidden',
      activeClass: 'active-thumb',
      variantSoldOut: 'product-form--variant-sold-out'
    };

    this.$quantityInput = $(this.selectors.quantity, $container);
    this.$errorMessageWrapper = $(
      this.selectors.errorMessageWrapper,
      $container
    );
    this.$addToCart = $(this.selectors.addToCart, $container);
    this.$addToCartText = $(this.selectors.addToCartText, this.$addToCart);
    this.$shopifyPaymentButton = $(
      this.selectors.shopifyPaymentButton,
      $container
    );
    this.$productPolicies = $(this.selectors.productPolicies, $container);

    this.$loader = $(this.selectors.loader, this.$addToCart);
    this.$loaderStatus = $(this.selectors.loaderStatus, $container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$('#ProductJson-' + sectionId).html()) {
      return;
    }

    this.productSingleObject = JSON.parse(
      document.getElementById('ProductJson-' + sectionId).innerHTML
    );

    this.settings.zoomEnabled = $(this.selectors.imageZoomWrapper).hasClass(
      this.classes.jsZoomEnabled
    );

    this._initBreakpoints();
    this._stringOverrides();
    this._initVariants();
    this._initMediaSwitch();
    this._initAddToCart();
    this._setActiveThumbnail();
    this._initProductVideo();
    this._initModelViewerLibraries();
    this._initShopifyXrLaunch();
  }

  Product.prototype = _.assignIn({}, Product.prototype, {
    _stringOverrides: function() {
      theme.productStrings = theme.productStrings || {};
      $.extend(theme.strings, theme.productStrings);
    },

    _initBreakpoints: function() {
      var self = this;

      enquire.register(this.settings.mediaQuerySmall, {
        match: function() {
          // initialize thumbnail slider on mobile if more than four thumbnails
          if ($(self.selectors.productThumbImages).length > 4) {
            self._initThumbnailSlider();
          }

          // destroy image zooming if enabled
          if (self.settings.zoomEnabled) {
            $(self.selectors.imageZoomWrapper).each(function() {
              _destroyZoom(this);
            });
          }

          self.settings.bpSmall = true;
        },
        unmatch: function() {
          if (self.settings.sliderActive) {
            self._destroyThumbnailSlider();
          }

          self.settings.bpSmall = false;
        }
      });

      enquire.register(this.settings.mediaQueryMediumUp, {
        match: function() {
          if (self.settings.zoomEnabled) {
            $(self.selectors.imageZoomWrapper).each(function() {
              _enableZoom(this);
            });
          }
        }
      });
    },

    _initVariants: function() {
      var options = {
        $container: this.$container,
        enableHistoryState:
          this.$container.data('enable-history-state') || false,
        singleOptionSelector: this.selectors.singleOptionSelector,
        originalSelectorId: this.selectors.originalSelectorId,
        product: this.productSingleObject
      };

      this.variants = new slate.Variants(options);

      this.$container.on(
        'variantChange' + this.settings.namespace,
        this._updateAvailability.bind(this)
      );
      this.$container.on(
        'variantImageChange' + this.settings.namespace,
        this._updateMedia.bind(this)
      );
      this.$container.on(
        'variantPriceChange' + this.settings.namespace,
        this._updatePrice.bind(this)
      );
      this.$container.on(
        'variantSKUChange' + this.settings.namespace,
        this._updateSKU.bind(this)
      );
    },

    _initMediaSwitch: function() {
      if (!$(this.selectors.productThumbImages).length) {
        return;
      }

      var self = this;

      $(this.selectors.productThumbImages)
        .on('click', function(evt) {
          evt.preventDefault();
          var $el = $(this);

          var mediaId = $el.data('thumbnail-id');

          self._switchMedia(mediaId);
          self._setActiveThumbnail(mediaId);
        })
        .on('keyup', self._handleMediaFocus.bind(self));
    },

    _initAddToCart: function() {
      $(this.selectors.productForm, this.$container).on(
        'submit',
        function(evt) {
          if (this.$addToCart.is('[aria-disabled]')) {
            evt.preventDefault();
            return;
          }

          if (!this.ajaxEnabled) return;

          evt.preventDefault();

          this.$previouslyFocusedElement = $(':focus');

          var isInvalidQuantity = this.$quantityInput.val() <= 0;

          if (isInvalidQuantity) {
            this._showErrorMessage(theme.strings.quantityMinimumMessage);
            return;
          }

          if (!isInvalidQuantity && this.ajaxEnabled) {
            // disable the addToCart and dynamic checkout button while
            // request/cart popup is loading and handle loading state
            this._handleButtonLoadingState(true);
            var $data = $(this.selectors.productForm, this.$container);
            this._addItemToCart($data);
            return;
          }
        }.bind(this)
      );
    },

    _initProductVideo: function() {
      var sectionId = this.settings.sectionId;

      $(this.selectors.productMediaTypeVideo, this.$container).each(function() {
        var $el = $(this);
        theme.ProductVideo.init($el, sectionId);
      });
    },

    _initModelViewerLibraries: function() {
      var $modelViewerElements = $(
        this.selectors.productMediaTypeModel,
        this.$container
      );
      if ($modelViewerElements.length < 1) return;
      theme.ProductModel.init($modelViewerElements, this.settings.sectionId);
    },

    _initShopifyXrLaunch: function() {
      var self = this;
      $(document).on('shopify_xr_launch', function() {
        var $currentMedia = $(
          self.selectors.productMediaWrapper +
            ':not(.' +
            self.classes.hidden +
            ')',
          self.$container
        );
        $currentMedia.trigger('xrLaunch');
      });
    },

    _addItemToCart: function(data) {
      var params = {
        url: '/cart/add.js',
        data: $(data).serialize(),
        dataType: 'json'
      };

      $.post(params)
        .done(
          function(item) {
            this._hideErrorMessage();
            this._setupCartPopup(item);
          }.bind(this)
        )
        .fail(
          function(response) {
            this.$previouslyFocusedElement.focus();
            var errorMessage = response.responseJSON
              ? response.responseJSON.description
              : theme.strings.cartError;
            this._showErrorMessage(errorMessage);
            this._handleButtonLoadingState(false);
          }.bind(this)
        );
    },

    _handleButtonLoadingState: function(isLoading) {
      if (isLoading) {
        this.$addToCart.attr('aria-disabled', true);
        this.$addToCartText.addClass(this.classes.hidden);
        this.$loader.removeClass(this.classes.hidden);
        this.$shopifyPaymentButton.attr('disabled', true);
        this.$loaderStatus.attr('aria-hidden', false);
      } else {
        this.$addToCart.removeAttr('aria-disabled');
        this.$addToCartText.removeClass(this.classes.hidden);
        this.$loader.addClass(this.classes.hidden);
        this.$shopifyPaymentButton.removeAttr('disabled');
        this.$loaderStatus.attr('aria-hidden', true);
      }
    },

    _showErrorMessage: function(errorMessage) {
      $(this.selectors.errorMessage, this.$container).html(errorMessage);

      if (this.$quantityInput.length !== 0) {
        this.$quantityInput.addClass(this.classes.inputError);
      }

      this.$errorMessageWrapper
        .removeClass(this.classes.productFormErrorMessageWrapperHidden)
        .attr('aria-hidden', true)
        .removeAttr('aria-hidden');
    },

    _hideErrorMessage: function() {
      this.$errorMessageWrapper.addClass(
        this.classes.productFormErrorMessageWrapperHidden
      );

      if (this.$quantityInput.length !== 0) {
        this.$quantityInput.removeClass(this.classes.inputError);
      }
    },

    _setupCartPopup: function(item) {
      this.$cartPopup = this.$cartPopup || $(this.selectors.cartPopup);
      this.$cartPopupWrapper =
        this.$cartPopupWrapper || $(this.selectors.cartPopupWrapper);
      this.$cartPopupTitle =
        this.$cartPopupTitle || $(this.selectors.cartPopupTitle);
      this.$cartPopupQuantity =
        this.$cartPopupQuantity || $(this.selectors.cartPopupQuantity);
      this.$cartPopupQuantityLabel =
        this.$cartPopupQuantityLabel ||
        $(this.selectors.cartPopupQuantityLabel);
      this.$cartPopupClose =
        this.$cartPopupClose || $(this.selectors.cartPopupClose);
      this.$cartPopupDismiss =
        this.$cartPopupDismiss || $(this.selectors.cartPopupDismiss);
      this.$cartPopupImagePlaceholder =
        this.$cartPopupImagePlaceholder ||
        $(this.selectors.cartPopupImagePlaceholder);

      this._setupCartPopupEventListeners();

      this._updateCartPopupContent(item);
    },

    _updateCartPopupContent: function(item) {
      var quantity = this.$quantityInput.length ? this.$quantityInput.val() : 1;

      this.$cartPopupTitle.text(item.product_title);
      this.$cartPopupQuantity.text(quantity);
      this.$cartPopupQuantityLabel.text(
        theme.strings.quantityLabel.replace('[count]', quantity)
      );

      this._setCartPopupPlaceholder(
        item.featured_image.url,
        item.featured_image.aspect_ratio
      );
      this._setCartPopupImage(item.featured_image.url, item.featured_image.alt);
      this._setCartPopupProductDetails(
        item.product_has_only_default_variant,
        item.options_with_values,
        item.properties
      );

      $.getJSON('/cart.js').then(
        function(cart) {
          this._setCartQuantity(cart.item_count);
          this._setCartCountBubble(cart.item_count);
          this._showCartPopup();
        }.bind(this)
      );
    },

    _setupCartPopupEventListeners: function() {
      this.$cartPopupWrapper.on(
        'keyup',
        function(event) {
          if (event.keyCode === slate.utils.keyboardKeys.ESCAPE) {
            this._hideCartPopup(event);
          }
        }.bind(this)
      );

      this.$cartPopupClose.on('click', this._hideCartPopup.bind(this));
      this.$cartPopupDismiss.on('click', this._hideCartPopup.bind(this));
      $('body').on('click', this._onBodyClick.bind(this));
    },

    _setCartPopupPlaceholder: function(imageUrl, imageAspectRatio) {
      this.$cartPopupImageWrapper =
        this.$cartPopupImageWrapper || $(this.selectors.cartPopupImageWrapper);

      if (imageUrl === null) {
        this.$cartPopupImageWrapper.addClass(this.classes.hidden);
        return;
      }

      var $placeholder = $(this.selectors.cartPopupPlaceholderSize);
      var maxWidth = 95 * imageAspectRatio;
      var heightRatio = 100 / imageAspectRatio;

      this.$cartPopupImagePlaceholder.css('max-width', maxWidth);

      $placeholder.css('padding-top', heightRatio + '%');
    },

    _setCartPopupImage: function(imageUrl, imageAlt) {
      if (imageUrl === null) return;

      this.$cartPopupImageWrapper.removeClass(this.classes.hidden);
      var sizedImageUrl = theme.Images.getSizedImageUrl(imageUrl, '200x');
      var image = document.createElement('img');
      image.src = sizedImageUrl;
      image.alt = imageAlt;
      image.classList.add(this.classes.cartImage);
      image.dataset.cartPopupImage = '';

      image.onload = function() {
        this.$cartPopupImagePlaceholder.addClass(this.classes.hidden);
        this.$cartPopupImageWrapper.append(image);
      }.bind(this);
    },

    _setCartPopupProductDetails: function(
      product_has_only_default_variant,
      options,
      properties
    ) {
      this.$cartPopupProductDetails =
        this.$cartPopupProductDetails ||
        $(this.selectors.cartPopupProductDetails);
      var variantPropertiesHTML = '';

      if (!product_has_only_default_variant) {
        variantPropertiesHTML =
          variantPropertiesHTML + this._getVariantOptionList(options);
      }

      if (properties !== null && Object.keys(properties).length !== 0) {
        variantPropertiesHTML =
          variantPropertiesHTML + this._getPropertyList(properties);
      }

      if (variantPropertiesHTML.length === 0) {
        this.$cartPopupProductDetails.html('');
        this.$cartPopupProductDetails.attr('hidden', '');
      } else {
        this.$cartPopupProductDetails.html(variantPropertiesHTML);
        this.$cartPopupProductDetails.removeAttr('hidden');
      }
    },

    _getVariantOptionList: function(variantOptions) {
      var variantOptionListHTML = '';

      variantOptions.forEach(function(variantOption) {
        variantOptionListHTML =
          variantOptionListHTML +
          '<li class="product-details__item product-details__item--variant-option">' +
          variantOption.name +
          ': ' +
          variantOption.value +
          '</li>';
      });

      return variantOptionListHTML;
    },

    _getPropertyList: function(properties) {
      var propertyListHTML = '';
      var propertiesArray = Object.entries(properties);

      propertiesArray.forEach(function(property) {
        // Line item properties prefixed with an underscore are not to be displayed
        if (property[0].charAt(0) === '_') return;

        // if the property value has a length of 0 (empty), don't display it
        if (property[1].length === 0) return;

        propertyListHTML =
          propertyListHTML +
          '<li class="product-details__item product-details__item--property">' +
          '<span class="product-details__property-label">' +
          property[0] +
          ': </span>' +
          property[1];
        ': ' + '</li>';
      });

      return propertyListHTML;
    },

    _setCartQuantity: function(quantity) {
      this.$cartPopupCartQuantity =
        this.$cartPopupCartQuantity || $(this.selectors.cartPopupCartQuantity);
      var ariaLabel;

      if (quantity === 1) {
        ariaLabel = theme.strings.oneCartCount;
      } else if (quantity > 1) {
        ariaLabel = theme.strings.otherCartCount.replace('[count]', quantity);
      }

      this.$cartPopupCartQuantity.text(quantity).attr('aria-label', ariaLabel);
    },

    _setCartCountBubble: function(quantity) {
      this.$cartCountBubble =
        this.$cartCountBubble || $(this.selectors.cartCountBubble);
      this.$cartCount = this.$cartCount || $(this.selectors.cartCount);

      this.$cartCountBubble.removeClass(this.classes.hidden);
      this.$cartCount.text(quantity);
    },

    _showCartPopup: function() {
      this.$cartPopupWrapper
        .prepareTransition()
        .removeClass(this.classes.cartPopupWrapperHidden);
      this._handleButtonLoadingState(false);

      slate.a11y.trapFocus({
        $container: this.$cartPopupWrapper,
        $elementToFocus: this.$cartPopup,
        namespace: 'cartPopupFocus'
      });
    },

    _hideCartPopup: function(event) {
      var setFocus = event.detail === 0 ? true : false;
      this.$cartPopupWrapper
        .prepareTransition()
        .addClass(this.classes.cartPopupWrapperHidden);

      $(this.selectors.cartPopupImage).remove();
      this.$cartPopupImagePlaceholder.removeClass(this.classes.hidden);

      slate.a11y.removeTrapFocus({
        $container: this.$cartPopupWrapper,
        namespace: 'cartPopupFocus'
      });

      if (setFocus) this.$previouslyFocusedElement[0].focus();

      this.$cartPopupWrapper.off('keyup');
      this.$cartPopupClose.off('click');
      this.$cartPopupDismiss.off('click');
      $('body').off('click');
    },

    _onBodyClick: function(event) {
      var $target = $(event.target);

      if (
        $target[0] !== this.$cartPopupWrapper[0] &&
        !$target.parents(this.selectors.cartPopup).length
      ) {
        this._hideCartPopup(event);
      }
    },

    _setActiveThumbnail: function(mediaId) {
      // If there is no element passed, find it by the current product image
      if (typeof mediaId === 'undefined') {
        mediaId = $(
          this.selectors.productMediaWrapper + ':not(.hide)',
          this.$container
        ).data('media-id');
      }

      var $thumbnailWrappers = $(
        this.selectors.productThumbListItem + ':not(.slick-cloned)',
        this.$container
      );

      var $activeThumbnail = $thumbnailWrappers.find(
        this.selectors.productThumbImages +
          "[data-thumbnail-id='" +
          mediaId +
          "']"
      );

      $(this.selectors.productThumbImages)
        .removeClass(this.classes.activeClass)
        .removeAttr('aria-current');

      $activeThumbnail.addClass(this.classes.activeClass);
      $activeThumbnail.attr('aria-current', true);

      if (!$thumbnailWrappers.hasClass('slick-slide')) {
        return;
      }

      var slideIndex = $activeThumbnail.parent().data('slick-index');

      $(this.selectors.productThumbs).slick('slickGoTo', slideIndex, true);
    },

    _switchMedia: function(mediaId) {
      var $currentMedia = $(
        this.selectors.productMediaWrapper +
          ':not(.' +
          this.classes.hidden +
          ')',
        this.$container
      );

      var $newMedia = $(
        this.selectors.productMediaWrapper +
          "[data-media-id='" +
          mediaId +
          "']",
        this.$container
      );

      var $otherMedia = $(
        this.selectors.productMediaWrapper +
          ":not([data-media-id='" +
          mediaId +
          "'])",
        this.$container
      );

      $currentMedia.trigger('mediaHidden');
      $newMedia.removeClass(this.classes.hidden).trigger('mediaVisible');
      $otherMedia.addClass(this.classes.hidden);
    },

    _handleMediaFocus: function(evt) {
      if (evt.keyCode !== slate.utils.keyboardKeys.ENTER) return;

      var mediaId = $(evt.currentTarget).data('thumbnail-id');

      $(
        this.selectors.productMediaWrapper +
          "[data-media-id='" +
          mediaId +
          "']",
        this.$container
      ).focus();
    },

    _initThumbnailSlider: function() {
      var options = {
        slidesToShow: 3,
        slidesToScroll: 2,
        infinite: false,
        prevArrow: '.thumbnails-slider__prev--' + this.settings.sectionId,
        nextArrow: '.thumbnails-slider__next--' + this.settings.sectionId
      };

      $(this.selectors.productThumbs).slick(options);

      // Accessibility concerns not yet fixed in Slick Slider
      $(this.selectors.productThumbsWrapper, this.$container)
        .find('.slick-list')
        .removeAttr('aria-live');
      $(this.selectors.productThumbsWrapper, this.$container)
        .find('.slick-disabled')
        .removeAttr('aria-disabled');

      this.settings.sliderActive = true;
    },

    _destroyThumbnailSlider: function() {
      $(this.selectors.productThumbs).slick('unslick');
      this.settings.sliderActive = false;

      // Accessibility concerns not yet fixed in Slick Slider
      $(this.selectors.productThumbsWrapper, this.$container)
        .find('[tabindex="-1"]')
        .removeAttr('tabindex');
    },

    _liveRegionText: function(variant) {
      // Dummy content for live region
      var liveRegionText =
        '[Availability] [Regular] [$$] [Sale] [$]. [UnitPrice] [$$$]';

      if (!variant) {
        liveRegionText = theme.strings.unavailable;
        return liveRegionText;
      }

      // Update availability
      var availability = variant.available ? '' : theme.strings.soldOut + ',';
      liveRegionText = liveRegionText.replace('[Availability]', availability);

      // Update pricing information
      var regularLabel = '';
      var regularPrice = theme.Currency.formatMoney(
        variant.price,
        theme.moneyFormat
      );
      var saleLabel = '';
      var salePrice = '';
      var unitLabel = '';
      var unitPrice = '';

      if (variant.compare_at_price > variant.price) {
        regularLabel = theme.strings.regularPrice;
        regularPrice =
          theme.Currency.formatMoney(
            variant.compare_at_price,
            theme.moneyFormat
          ) + ',';
        saleLabel = theme.strings.sale;
        salePrice = theme.Currency.formatMoney(
          variant.price,
          theme.moneyFormat
        );
      }

      if (variant.unit_price) {
        unitLabel = theme.strings.unitPrice;
        unitPrice =
          theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat) +
          ' ' +
          theme.strings.unitPriceSeparator +
          ' ' +
          this._getBaseUnit(variant);
      }

      liveRegionText = liveRegionText
        .replace('[Regular]', regularLabel)
        .replace('[$$]', regularPrice)
        .replace('[Sale]', saleLabel)
        .replace('[$]', salePrice)
        .replace('[UnitPrice]', unitLabel)
        .replace('[$$$]', unitPrice)
        .trim();

      return liveRegionText;
    },

    _updateLiveRegion: function(evt) {
      var variant = evt.variant;
      var liveRegion = this.container.querySelector(
        this.selectors.productStatus
      );
      liveRegion.innerHTML = this._liveRegionText(variant);
      liveRegion.setAttribute('aria-hidden', false);

      // hide content from accessibility tree after announcement
      setTimeout(function() {
        liveRegion.setAttribute('aria-hidden', true);
      }, 1000);
    },

    _updateAddToCart: function(evt) {
      var variant = evt.variant;

      if (variant) {
        if (variant.available) {
          this.$addToCart
            .removeAttr('aria-disabled')
            .attr('aria-label', theme.strings.addToCart);
          $(this.selectors.addToCartText, this.$container).text(
            theme.strings.addToCart
          );
          $(this.selectors.productForm, this.container).removeClass(
            this.classes.variantSoldOut
          );
        } else {
          // Variant is sold out, disable submit button and change the text.
          this.$addToCart
            .attr('aria-disabled', true)
            .attr('aria-label', theme.strings.soldOut);
          $(this.selectors.addToCartText, this.$container).text(
            theme.strings.soldOut
          );
          $(this.selectors.productForm, this.container).addClass(
            this.classes.variantSoldOut
          );
        }
      } else {
        // The variant doesn't exist, disable submit button and change the text.
        this.$addToCart
          .attr('aria-disabled', true)
          .attr('aria-label', theme.strings.unavailable);
        $(this.selectors.addToCartText, this.$container).text(
          theme.strings.unavailable
        );
        $(this.selectors.productForm, this.container).addClass(
          this.classes.variantSoldOut
        );
      }
    },

    _updateAvailability: function(evt) {
      // remove error message if one is showing
      this._hideErrorMessage();

      // update form submit
      this._updateAddToCart(evt);
      // update live region
      this._updateLiveRegion(evt);

      this._updatePrice(evt);
    },

    _updateMedia: function(evt) {
      var variant = evt.variant;
      var mediaId = variant.featured_media.id;
      var sectionMediaId = this.settings.sectionId + '-' + mediaId;

      this._switchMedia(sectionMediaId);
      this._setActiveThumbnail(sectionMediaId);
    },

    _updatePrice: function(evt) {
      var variant = evt.variant;

      var $priceContainer = $(this.selectors.priceContainer, this.$container);
      var $regularPrice = $(this.selectors.regularPrice, $priceContainer);
      var $salePrice = $(this.selectors.salePrice, $priceContainer);
      var $unitPrice = $(this.selectors.unitPrice, $priceContainer);
      var $unitPriceBaseUnit = $(
        this.selectors.unitPriceBaseUnit,
        $priceContainer
      );

      // Reset product price state
      $priceContainer
        .removeClass(this.classes.productUnavailable)
        .removeClass(this.classes.productOnSale)
        .removeClass(this.classes.productUnitAvailable)
        .removeClass(this.classes.productSoldOut)
        .removeAttr('aria-hidden');

      this.$productPolicies.removeClass(this.classes.visibilityHidden);

      // Unavailable
      if (!variant) {
        $priceContainer
          .addClass(this.classes.productUnavailable)
          .attr('aria-hidden', true);

        this.$productPolicies.addClass(this.classes.visibilityHidden);
        return;
      }

      // Sold out
      if (!variant.available) {
        $priceContainer.addClass(this.classes.productSoldOut);
      }

      // On sale
      if (variant.compare_at_price > variant.price) {
        $regularPrice.html(
          theme.Currency.formatMoney(
            variant.compare_at_price,
            theme.moneyFormat
          )
        );
        $salePrice.html(
          theme.Currency.formatMoney(variant.price, theme.moneyFormat)
        );
        $priceContainer.addClass(this.classes.productOnSale);
      } else {
        // Regular price
        $regularPrice.html(
          theme.Currency.formatMoney(variant.price, theme.moneyFormat)
        );
      }

      // Unit price
      if (variant.unit_price) {
        $unitPrice.html(
          theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat)
        );
        $unitPriceBaseUnit.html(this._getBaseUnit(variant));
        $priceContainer.addClass(this.classes.productUnitAvailable);
      }
    },

    _getBaseUnit: function(variant) {
      return variant.unit_price_measurement.reference_value === 1
        ? variant.unit_price_measurement.reference_unit
        : variant.unit_price_measurement.reference_value +
            variant.unit_price_measurement.reference_unit;
    },

    _updateSKU: function(evt) {
      var variant = evt.variant;

      // Update the sku
      $(this.selectors.SKU).html(variant.sku);
    },

    onUnload: function() {
      this.$container.off(this.settings.namespace);
      theme.ProductVideo.removeSectionVideos(this.settings.sectionId);
      theme.ProductModel.removeSectionModels(this.settings.sectionId);
    }
  });

  function _enableZoom(el) {
    var zoomUrl = $(el).data('zoom');
    $(el).zoom({
      url: zoomUrl
    });
  }

  function _destroyZoom(el) {
    $(el).trigger('zoom.destroy');
  }

  return Product;
})();

theme.ProductRecommendations = (function() {
  function ProductRecommendations(container) {
    this.$container = $(container);

    var baseUrl = this.$container.data('baseUrl');
    var productId = this.$container.data('productId');
    var recommendationsSectionUrl =
      baseUrl +
      '?section_id=product-recommendations&product_id=' +
      productId +
      '&limit=4';

    $.get(recommendationsSectionUrl).then(
      function(section) {
        var recommendationsMarkup = $(section).html();
        if (recommendationsMarkup.trim() !== '') {
          this.$container.html(recommendationsMarkup);
        }
      }.bind(this)
    );
  }

  return ProductRecommendations;
})();

theme.Quotes = (function() {
  var config = {
    mediaQuerySmall: 'screen and (max-width: 749px)',
    mediaQueryMediumUp: 'screen and (min-width: 750px)',
    slideCount: 0
  };
  var defaults = {
    accessibility: true,
    arrows: false,
    dots: true,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  function Quotes(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var wrapper = (this.wrapper = '.quotes-wrapper');
    var slider = (this.slider = '#Quotes-' + sectionId);
    var $slider = $(slider, wrapper);

    var sliderActive = false;
    var mobileOptions = $.extend({}, defaults, {
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true
    });

    config.slideCount = $slider.data('count');

    // Override slidesToShow/Scroll if there are not enough blocks
    if (config.slideCount < defaults.slidesToShow) {
      defaults.slidesToShow = config.slideCount;
      defaults.slidesToScroll = config.slideCount;
    }

    $slider.on('init', this.a11y.bind(this));

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });

    enquire.register(config.mediaQueryMediumUp, {
      match: function() {
        initSlider($slider, defaults);
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }
  }

  Quotes.prototype = _.assignIn({}, Quotes.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.quotes-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return Quotes;
})();

theme.slideshows = {};

theme.SlideshowSection = (function() {
  function SlideshowSection(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var slideshow = (this.slideshow = '#Slideshow-' + sectionId);

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow, sectionId);
  }

  return SlideshowSection;
})();

theme.SlideshowSection.prototype = _.assignIn(
  {},
  theme.SlideshowSection.prototype,
  {
    onUnload: function() {
      delete theme.slideshows[this.slideshow];
    },

    onBlockSelect: function(evt) {
      var $slideshow = $(this.slideshow);
      var adaptHeight = $slideshow.data('adapt-height');

      if (adaptHeight) {
        theme.slideshows[this.slideshow].setSlideshowHeight();
      }

      // Ignore the cloned version
      var $slide = $(
        '.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause auto-rotate
      $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
    },

    onBlockDeselect: function() {
      // Resume auto-rotate
      $(this.slideshow).slick('slickPlay');
    }
  }
);

theme.slideshows = {};

theme.VideoSection = (function() {
  function VideoSection(container) {
    var $container = (this.$container = $(container));

    $('.video', $container).each(function() {
      var $el = $(this);
      theme.Video.init($el);
      theme.Video.editorLoadVideo($el.attr('id'));
    });
  }

  return VideoSection;
})();

theme.VideoSection.prototype = _.assignIn({}, theme.VideoSection.prototype, {
  onUnload: function() {
    theme.Video.removeEvents();
  }
});

theme.heros = {};

theme.HeroSection = (function() {
  function HeroSection(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var hero = '#Hero-' + sectionId;
    theme.heros[hero] = new theme.Hero(hero, sectionId);
  }

  return HeroSection;
})();

window.theme = window.theme || {};

var selectors = {
  disclosureLocale: '[data-disclosure-locale]',
  disclosureCurrency: '[data-disclosure-currency]'
};

theme.FooterSection = (function() {
  function Footer(container) {
    this.$container = $(container);
    this.cache = {};
    this.cacheSelectors();

    if (this.cache.$localeDisclosure.length) {
      this.localeDisclosure = new theme.Disclosure(
        this.cache.$localeDisclosure
      );
    }

    if (this.cache.$currencyDisclosure.length) {
      this.currencyDisclosure = new theme.Disclosure(
        this.cache.$currencyDisclosure
      );
    }
  }

  Footer.prototype = _.assignIn({}, Footer.prototype, {
    cacheSelectors: function() {
      this.cache = {
        $localeDisclosure: this.$container.find(selectors.disclosureLocale),
        $currencyDisclosure: this.$container.find(selectors.disclosureCurrency)
      };
    },

    onUnload: function() {
      if (this.cache.$localeDisclosure.length) {
        this.localeDisclosure.unload();
      }

      if (this.cache.$currencyDisclosure.length) {
        this.currencyDisclosure.unload();
      }
    }
  });

  return Footer;
})();


$(document).ready(function() {
  var sections = new theme.Sections();

  sections.register('cart-template', theme.Cart);
  sections.register('product', theme.Product);
  sections.register('collection-template', theme.Filters);
  sections.register('product-template', theme.Product);
  sections.register('header-section', theme.HeaderSection);
  sections.register('map', theme.Maps);
  sections.register('slideshow-section', theme.SlideshowSection);
  sections.register('video-section', theme.VideoSection);
  sections.register('quotes', theme.Quotes);
  sections.register('hero-section', theme.HeroSection);
  sections.register('product-recommendations', theme.ProductRecommendations);
  sections.register('footer-section', theme.FooterSection);
});

theme.init = function() {
  theme.customerTemplates.init();

  // Theme-specific selectors to make tables scrollable
  var tableSelectors = '.rte table,' + '.custom__item-inner--html table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'scrollable-wrapper'
  });

  // Theme-specific selectors to make iframes responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"],' +
    '.custom__item-inner--html iframe[src*="youtube.com/embed"],' +
    '.custom__item-inner--html iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'video-wrapper'
  });

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  $('a[href="#"]').on('click', function(evt) {
    evt.preventDefault();
  });

  slate.a11y.accessibleLinks({
    messages: {
      newWindow: theme.strings.newWindow,
      external: theme.strings.external,
      newWindowExternal: theme.strings.newWindowExternal
    },
    $links: $('a[href]:not([aria-describedby], .product-single__thumbnail)')
  });

  theme.FormStatus.init();

  var selectors = {
    image: '[data-image]',
    imagePlaceholder: '[data-image-placeholder]',
    imageWithPlaceholderWrapper: '[data-image-with-placeholder-wrapper]',
    lazyloaded: '.lazyloaded'
  };

  var classes = {
    hidden: 'hide'
  };

  $(document).on('lazyloaded', function(e) {
    var $target = $(e.target);

    if ($target.data('bgset')) {
      var $image = $target.find(selectors.lazyloaded);
      if ($image.length) {
        var alt = $target.data('alt');
        var src = $image.data('src') ? $image.data('src') : $target.data('bg');

        $image.attr('alt', alt ? alt : '');
        $image.attr('src', src ? src : '');
      }
    }

    if (!$target.is(selectors.image)) {
      return;
    }

    $target
      .closest(selectors.imageWithPlaceholderWrapper)
      .find(selectors.imagePlaceholder)
      .addClass(classes.hidden);
  });

  // When the theme loads, lazysizes might load images before the "lazyloaded"
  // event listener has been attached. When this happens, the following function
  // hides the loading placeholders.
  function onLoadHideLazysizesAnimation() {
    $(selectors.image + '.lazyloaded')
      .closest(selectors.imageWithPlaceholderWrapper)
      .find(selectors.imagePlaceholder)
      .addClass(classes.hidden);
  }

  onLoadHideLazysizesAnimation();
  $(document).one('touchstart', function() {
    theme.Helpers.setTouch();
  });
};

// Youtube API callback
// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
  theme.Video.loadVideos();
  theme.ProductVideo.loadVideos(theme.ProductVideo.hosts.youtube);
}

$(theme.init);
