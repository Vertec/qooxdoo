/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

************************************************************************ */

/**
 * This singleton is used to manager multiple instances of popups and their
 * state.
 */
qx.Class.define("qx.ui.popup.PopupManager",
{
  type : "singleton",
  extend : qx.core.Object,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    // Create data structure
    this.__objects = {};

    // Register mousedown handler
    var root = qx.core.Init.getApplication().getRoot();
    root.addListener("mousedown", this.__onMouseDown, this, true);

    // Hide all popups on window blur
    qx.bom.Element.addListener(window, "blur", this.hideAll, this);
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    add : function(obj)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!(obj instanceof qx.ui.popup.Popup)) {
          throw new Error("Object is no popup: " + obj);
        }
      }

      this.__objects[obj.$$hash] = obj;
      this.__updateIndexes();
    },


    remove : function(obj)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!(obj instanceof qx.ui.popup.Popup)) {
          throw new Error("Object is no popup: " + obj);
        }
      }

      delete this.__objects[obj.$$hash];
      this.__updateIndexes();
    },


    hideAll : function()
    {
      var reg = this.__objects;
      for (var hash in reg) {
        reg[hash].exclude();
      }
    },




    /*
    ---------------------------------------------------------------------------
      INTERNAL HELPER
    ---------------------------------------------------------------------------
    */

    /**
     * Updates the zIndex of all registered items to push
     * newly added ones on top of existing ones
     *
     * @type member
     * @return {void}
     */
    __updateIndexes : function()
    {
      var min = 1e6;
      var reg = this.__objects;
      for (var hash in reg) {
        reg[hash].setZIndex(min++);
      }
    },




    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER
    ---------------------------------------------------------------------------
    */

    /**
     * Event handler for mouse down events
     *
     * @param e {qx.event.type.Mouse} Mouse event object
     */
    __onMouseDown : function(e)
    {
      var target = e.getTarget();

      var reg = this.__objects;
      for (var hash in reg)
      {
        obj = reg[hash];

        if (!obj.getAutoHide() || target == obj || qx.ui.core.Widget.contains(obj, target)) {
          continue;
        }

        obj.exclude();
      }
    }
  },



  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() {
    this._disposeMap("__objects");
  }
});
